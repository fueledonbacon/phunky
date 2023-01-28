import { computed, markRaw, reactive, ref } from 'vue'
import * as Toast from 'vue-toastification'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'

import wallet from './inventory'
import staked from './staked'
import { CHAINID_CONFIG_MAP, getCurrency } from '@/utils/metamask'
import { getEthereum } from '@/utils/web3'

const activeAccount = ref('')
const balance = ref('')
const contract = ref(null as ethers.Contract | null)
const network = ref(null as ethers.providers.Network | null)
const provider = ref(null as ethers.providers.Web3Provider | null)
const listenersCreated = ref(false)
const isNftsLoaded = ref(false)
const isStakedNftsLoaded = ref(false)

const hexChainId = computed(() => '0x' + network.value?.chainId.toString(16))
const networkName = computed(() => network.value?.name)
const chainId = computed(() => network.value?.chainId.toString())
const accountCompact = computed(() => activeAccount.value
  ? `${
      activeAccount.value.substring(0, 6)
    }...${
      activeAccount.value.substring(activeAccount.value.length - 6)
    }`.toUpperCase()
  : 'Connect MetaMask'
)
const nfts = computed(() => wallet.tokens)
const stakedNfts = computed(() => staked.tokens)

const createTransaction = async (
  { address, amount }: { address: string, amount: string }
) => {
  const signer = provider.value?.getSigner()
  return signer?.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(amount)
  })
}

export const setAccountNFT = (tokens: any) => {
  wallet.tokens = tokens
}

export const setAccountStakedNFT = (tokens: any) => {
  staked.tokens = tokens
}

export const fetchAccountNFT = async (breakCache = false) => {
  try {
    if (!activeAccount.value) {
      // Wallet undefined
      return
    }

    // Getting NFT of the account
    const accContract = await getContract()
    if (breakCache) {
      wallet.clearTokens()
    }

    await wallet.getNFTs()
    isNftsLoaded.value = true
  } catch (err) {
    // TODO: Error handler
  }
}

export const fetchAccountStakedNFT = async (breakCache = false) => {
  try {
    if (!activeAccount.value) {
      // Wallet undefined
      return
    }

    // Getting NFT of the account
    // const stakingContract = await getStakingContract()
    if (breakCache) {
      staked.clearTokens()
    }

    await staked.getStakedNFTs()
    isStakedNftsLoaded.value = true
  } catch (err) {
    // TODO: Error handler
  }
}

const getContract = async () => {
  if (contract.value) { return contract.value }

  try {
    await setContract()
    return contract.value
  } catch (err) {}
}

const connect = async () => {
  await detectEthereumProvider()

  network.value = await provider.value?.getNetwork() || null

  const [account] = await provider.value?.send('eth_requestAccounts', [])
  if (account) {
    await setAccount(account)
    fetchAccountNFT()
    fetchAccountStakedNFT()
  } else {
    // Account not returned
  }
}

const disconnect = () => {
  activeAccount.value = ''
  balance.value = ''
}

const switchNetwork = async (newChainId: string) => {
  if (
    !newChainId ||
    chainId.value?.toString() === newChainId.toString() ||
    hexChainId.value === newChainId
  ) {
    return
  }

  const config = CHAINID_CONFIG_MAP[newChainId]

  try {
    await provider.value?.send('wallet_switchEthereumChain', [
      { chainId: config.chainId }
    ])

    await init()

    // Create a minor delay to let the wallet reset to new network
    return new Promise((resolve) => {
      setTimeout(() => resolve(''), 1000)
    })
  } catch (err: any) {
    if (err.code === 4902) {
      await provider.value?.send('wallet_addEthereumChain', [config])
    } else {
      throw err
    }
  }
}

const setContract = async () => {
  if (chainId.value !== smartContract.chainId) {
    await switchNetwork(smartContract.chainId)
  }

  if (!activeAccount.value) {
    await connect()
  }

  contract.value = new ethers.Contract(
    smartContract.contractAddress,
    smartContract.abi,
    provider.value?.getSigner()
  )
}

const setAccount = async (newAccount: string) => {
  if (newAccount) {
    // Set Account
    activeAccount.value = newAccount
    const accountBalance = await provider.value?.getBalance(newAccount)
    balance.value = `${
      (+ethers.utils.formatEther(accountBalance?.toString() || '')).toFixed(3)
    } ${getCurrency(network.value?.chainId.toString() || '')}`
  } else {
    disconnect()
  }
}

const init = async () => {
  // Avoid this on server side
  if (typeof window.ethereum === 'undefined') { return }

  const eth: any = await detectEthereumProvider()

  if (!listenersCreated.value) {
    eth.on('accountsChanged', ([newAddress]: string[]) => {
      setAccount(newAddress)
    })

    eth.on('chainChanged', (chainId: string) => {
      window.location.reload()
    })

    listenersCreated.value = true
  }

  provider.value = markRaw(new ethers.providers.Web3Provider(eth))
  network.value = await provider.value.getNetwork()
  const [account] = await provider.value.listAccounts()
  isNftsLoaded.value = false
  isStakedNftsLoaded.value = false

  if (account) {
    await setAccount(account)
  }
}

export default reactive({
  activeAccount,
  provider,

  networkName,
  accountCompact,
  nfts,
  stakedNfts,
  isNftsLoaded,
  isStakedNftsLoaded,

  createTransaction,
  setAccountNFT,
  setAccountStakedNFT,
  connect,
  init
})

export const useAccount = () => {
  const toast = Toast.useToast && Toast.useToast()
  const msg = 'Please connect using a browser with Metamask, or connect on mobile using the Metamask mobile'

  const toggleWallet = async () => {
    if (!getEthereum()) {
      toast.warning(msg, {
        position: Toast.POSITION.TOP_RIGHT,
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        icon: true
      })

      return
    }

    try {
      if (!activeAccount.value) {
        await connect()
      } else {
        await disconnect()
      }
    } catch (err: any) {
      toast.error(err.message || 'Wallet connection failed', {
        position: Toast.POSITION.TOP_RIGHT,
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        icon: true
      })
    }
  }

  return {
    toggleWallet
  }
}

init()
