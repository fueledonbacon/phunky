import Vue, { reactive, markRaw, computed, createElementBlock } from 'vue'
import { ExternalProvider } from '@ethersproject/providers'
import { Contract, ethers, providers, BigNumber } from 'ethers'
import { Connector } from '../wallets'
import { useEthers } from './useEthers'
import * as Toast from 'vue-toastification'
import inventory from './inventory'
import staked from './staked'
import { phunkyContract, mushiesContract, stakingContract, karmaContract } from '@/consts'

const toast = Toast.useToast && Toast.useToast()

export type ConnectionStatus = 'none' | 'connecting' | 'loading' | 'connected'

const wallet = reactive({
  connector: null as Connector | null,
  provider: null as providers.ExternalProvider | null,
  error: '',
  status: 'none' as ConnectionStatus,
  isNftsLoaded: false,
  isStakedNftsLoaded: false,
  stakingStatus: '',
  claimableReward: 0
})

export type OnDisconnectCallback = (...args: any[]) => void
export type OnAccountsChangedCallback = (accounts: string[]) => void
export type OnChainChangedCallback = (chainId: number) => void

const callbacks = reactive({
  onDisconnectCallback: null as OnDisconnectCallback | null,
  onAccountsChangedCallback: null as OnAccountsChangedCallback | null,
  onChainChangedCallback: null as OnChainChangedCallback | null
})

export type useWalletOptions = {
  useEthers: boolean
}

const nfts = computed(() => inventory.tokens)
const stakedNfts = computed(() => staked.tokens)
const karmaAmount = computed(() => staked.stakeInfo.karmaAmount)

const totalStaked = computed(() => staked.stakeInfo.totalStaked)
const phunkyToStake: Array<any> = []
const mushiesToStake: Array<any> = []
const phunkyToUnstake: Array<any> = []
const mushiesToUnstake: Array<any> = []

const { provider, signer } = useEthers()

export const stake = async (tokens: any) => {
  for (const token of tokens) {
    if (token.name.includes('Phunky Fungi')) {
      phunkyToStake.push(token)
    } else {
      mushiesToStake.push(token)
    }
  }

  if (!tokens.length) {
    toast.error('Please Select Any Items To STAKE')
    return
  }

  const _phunkyContract = new ethers.Contract(
    phunkyContract.contractAddress,
    phunkyContract.abi,
    provider.value?.getSigner()
  )
  const _mushiesContract = new ethers.Contract(
    mushiesContract.contractAddress,
    mushiesContract.abi,
    provider.value?.getSigner()
  )

  const phunkyTokenIds = phunkyToStake.map((item) =>
    parseInt(item.tokenID)
  )
  const mushiesTokenIds = mushiesToStake.map((item) =>
    parseInt(item.tokenID)
  )
  try {
    if (phunkyToStake.length) {
      wallet.stakingStatus = 'Confirming Phunky Fungis...'
      const isApproved = await _phunkyContract.isApprovedForAll(
        wallet.provider.selectedAddress,
        stakingContract.contractAddress
      )
      wallet.stakingStatus = ''

      if (!isApproved) {
        const tx = await _phunkyContract.setApprovalForAll(
          stakingContract.contractAddress,
          true
        )
        wallet.stakingStatus = 'Approving Phunky Fungis...'
        await tx.wait()
        wallet.stakingStatus = ''
      }
    }

    if (mushiesToStake.length) {
      wallet.stakingStatus = 'Confirming Mutant Mushies...'
      const isApproved = await _mushiesContract.isApprovedForAll(
        wallet.provider.selectedAddress,
        stakingContract.contractAddress
      )
      wallet.stakingStatus = ''

      if (!isApproved) {
        const tx = await _mushiesContract.setApprovalForAll(
          stakingContract.contractAddress,
          true
        )
        wallet.stakingStatus = 'Approving Mutant Mushies...'
        await tx.wait()
        wallet.stakingStatus = ''
      }
    }

    const _stakingContract = new ethers.Contract(
      stakingContract.contractAddress,
      stakingContract.abi,
      provider.value?.getSigner()
    )
    if (phunkyToStake.length) {
      wallet.stakingStatus = 'Confirming...'
      const tx_stake = await _stakingContract.batchStake(1, phunkyTokenIds)
      wallet.stakingStatus = 'Staking Phunky Fungis...'
      await tx_stake.wait()
      wallet.stakingStatus = ''
    }
    if (mushiesToStake.length) {
      wallet.stakingStatus = 'Confirming...'
      const tx_stake = await _stakingContract.batchStake(0, mushiesTokenIds)
      wallet.stakingStatus = 'Staking Mutant Mushies...'
      await tx_stake.wait()
      wallet.stakingStatus = ''
    }
    inventory.tokens = inventory.tokens.filter((item) =>
      (item.name.includes('Phunky Fungi') && !phunkyTokenIds.includes(parseInt(item.tokenID))) ||
      (item.name.includes('Mutant Mushies') && !mushiesTokenIds.includes(parseInt(item.tokenID)))
    )
    staked.tokens = [...staked.tokens, ...tokens]
  } catch (err) {
    console.log(err)
    wallet.stakingStatus = ''
  }
}

export const unstake = async (tokens: any) => {
  for (const token of tokens) {
    if (token.name.includes('Phunky Fungi')) {
      phunkyToUnstake.push(token)
    } else {
      mushiesToUnstake.push(token)
    }
  }

  if (!tokens.length) {
    toast.error('Please Select Any Items To UNSTAKE')
    return
  }

  const phunkyTokenIds = phunkyToUnstake.map((item) =>
    parseInt(item.tokenID)
  )
  const mushiesTokenIds = mushiesToUnstake.map((item) =>
    parseInt(item.tokenID)
  )
  try {
    const _stakingContract = new ethers.Contract(
      stakingContract.contractAddress,
      stakingContract.abi,
      provider.value?.getSigner()
    )
    if (phunkyToUnstake.length) {
      wallet.stakingStatus = 'Confirming Phunky Fungis...'
      const tx_unstake = await _stakingContract.batchUnstake(1, phunkyTokenIds)
      wallet.stakingStatus = 'Unstaking Phunky Fungis...'
      await tx_unstake.wait()
      wallet.stakingStatus = ''
    }
    if (mushiesToUnstake.length) {
      wallet.stakingStatus = 'Confirming Mutant Mushies...'
      const tx_unstake = await _stakingContract.batchUnstake(0, mushiesTokenIds)
      wallet.stakingStatus = 'Unstaking Mutant Mushies...'
      await tx_unstake.wait()
      wallet.stakingStatus = ''
    }
    staked.tokens = staked.tokens.filter((item) =>
      (item.name.includes('Mutant Mushies') && !phunkyTokenIds.includes(parseInt(item.tokenID))) ||
      (item.name.includes('Phunky Fungi') && !mushiesTokenIds.includes(parseInt(item.tokenID)))
    )
    inventory.tokens = [...inventory.tokens, ...tokens]
    staked.getKarmaInfo(wallet.provider.selectedAddress, provider.value)
  } catch (err) {
    console.log(err)
    wallet.stakingStatus = ''
  }
}

export function useWallet (options: useWalletOptions = { useEthers: true }) {
  const clearWallet = () => {
    wallet.connector = null
    wallet.provider = null
    wallet.error = ''
    wallet.status = 'none'
    wallet.isNftsLoaded = false
    wallet.isStakedNftsLoaded = false

    if (options.useEthers) {
      const { deactivate } = useEthers()
      deactivate()
    }
  }

  async function reactivate () {
    const { activate } = useEthers()
    wallet.status = 'loading'
    try {
      if (wallet.provider) {
        await activate(wallet.provider)
        wallet.status = 'connected'
        fetchAccountNFT()
        fetchAccountStakedNFT()
      } else {
        wallet.status = 'none'
      }
    } catch (err: any) {
      clearWallet()
      wallet.error = err.message
      throw new Error(err)
    }
  }

  async function fetchAccountNFT (breakCache = false) {
    try {
      // Getting NFT of the account
      wallet.isNftsLoaded = false

      if (breakCache) {
        inventory.clearTokens()
      }

      await inventory.getNFTs(wallet.provider.selectedAddress)
      wallet.isNftsLoaded = true
    } catch (err) {
      // TODO: Error handler
    }
  }

  async function fetchAccountStakedNFT (breakCache = false) {
    try {
      // Getting NFT of the account
      // const stakingContract = await getStakingContract()
      wallet.isStakedNftsLoaded = false

      if (breakCache) {
        staked.clearTokens()
      }

      await staked.getKarmaInfo(wallet.provider.selectedAddress, provider.value)
      await staked.getStakedNFTs(wallet.provider.selectedAddress, provider.value)

      wallet.isStakedNftsLoaded = true
    } catch (err) {
      // TODO: Error handler
    }
  }

  async function connectWith (connector: Connector) {
    wallet.status = 'connecting'
    wallet.error = ''

    try {
      if (!connector) throw new Error('Incorrect connector argument')

      const { provider } = await connector.connect()

      wallet.connector = markRaw(connector)
      wallet.provider = markRaw(provider)

      if (options.useEthers) {
        wallet.status = 'loading'
        const { activate } = useEthers()
        await activate(wallet.provider as ExternalProvider)
      }
    } catch (err: any) {
      await disconnect() // will also clearWallet()
      wallet.error = err.message
      throw new Error(err)
    }

    wallet.status = 'connected'

    fetchAccountNFT()
    fetchAccountStakedNFT()
    wallet.claimableReward = await staked.updateClaimableReward(wallet.provider.selectedAddress, provider.value)
    // subscribe events
    if (wallet.connector) {
      wallet.connector.onDisconnect((...args: any[]) => {
        callbacks.onDisconnectCallback &&
          callbacks.onDisconnectCallback(...args)
        /**
         * Exclude metamask to disconnect on this event
         * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
         * so if we disconnect in this case, it would fail to reactivate ethers when chain changed
         * because the wallet state was cleared.
         * @todo better solution
         */
        if (wallet.connector?.name === 'metaMask') {
          return
        }
        disconnect()
      })
    }

    if (wallet.connector) {
      wallet.connector.onAccountsChanged(async (accounts: string[]) => {
        callbacks.onAccountsChangedCallback &&
          callbacks.onAccountsChangedCallback!(accounts)
        if (options.useEthers) {
          await reactivate()
        }
      })
    }

    if (wallet.connector) {
      wallet.connector.onChainChanged(async (chainId: number) => {
        callbacks.onChainChangedCallback &&
          callbacks.onChainChangedCallback!(chainId)
        if (options.useEthers) {
          await reactivate()
        }
      })
    }
  }

  async function disconnect () {
    if (wallet.connector) {
      try {
        await wallet.connector.disconnect()
      } catch (err: any) {
        clearWallet()
        throw new Error(err)
      }
    }
    clearWallet()
  }

  function onDisconnect (callback: OnDisconnectCallback) {
    callbacks.onDisconnectCallback = callback
  }

  function onAccountsChanged (callback: OnAccountsChangedCallback) {
    callbacks.onAccountsChangedCallback = callback
  }

  function onChainChanged (callback: OnChainChangedCallback) {
    callbacks.onChainChangedCallback = callback
  }

  return {
    wallet,
    nfts,
    stakedNfts,
    karmaAmount,
    totalStaked,

    stake,
    unstake,

    connectWith,
    disconnect,

    onDisconnect,
    onAccountsChanged,
    onChainChanged
  }
}
