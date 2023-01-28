import { computed, reactive, ref } from 'vue'
import { Contract, ethers } from 'ethers'
import { mushiesContract, phunkyContract, stakingContract, karmaContract } from '@/consts'
import { Web3Provider } from 'vue-dapp'

export type Token = {
  tokenID: string,
  name: string,
  image: string,
  description: string,
  attributes: { trait_type: string, value: string }[]
}
const stakeInfo = reactive({
  karmaAmount: '0',
  claimableReward: 0,
  totalStaked: 0
})
const tokens = ref([] as Token[])
const balance = ref(-1 as number)
const balanceChecked = computed(() => balance.value >= 0)

const tokenMap = computed(() => tokens.value
  .reduce(
    (map, token) => ({ ...map, [token.tokenID]: token }),
    {} as Record<string, Token>)
)

const addToken = (token: Token) => {
  if (!tokenMap.value[token.tokenID]) {
    tokens.value.push(token)
  }
}

const clearTokens = () => {
  tokens.value = []
  balance.value = -1
}

const getStakedNFTs = async (account: string, provider: Web3Provider) => {
  try {
    const _phunkyContract = new ethers.Contract(
      phunkyContract.contractAddress,
      phunkyContract.abi,
      provider
    )
    const _mushiesContract = new ethers.Contract(
      mushiesContract.contractAddress,
      mushiesContract.abi,
      provider
    )
    const _stakingContract = new Contract(
      stakingContract.contractAddress,
      stakingContract.abi,
      provider
    )
    const phunkyReward = ethers.utils.formatEther(
      await _stakingContract.totalClaimableReward(account, 1)
    )
    const mushiesReward = ethers.utils.formatEther(
      await _stakingContract.totalClaimableReward(account, 0)
    )

    stakeInfo.claimableReward = parseInt(phunkyReward) + parseInt(mushiesReward)
    const phunky = await _stakingContract.getUserStakedTokens(account, 1)
    const mushies = await _stakingContract.getUserStakedTokens(account, 0)

    for (const id of phunky) {
      const uri = await _phunkyContract.tokenURI(id)
      const res = await fetch(`https://cloudflare-ipfs.com/ipfs/${uri.slice(7)}`)
      const data = await res.json()
      addToken({ tokenID: `${id}`, name: data.name, image: data.image, description: data.description, attributes: data.attributes })
    }

    for (const id of mushies) {
      const uri = await _mushiesContract.tokenURI(id)
      const res = await fetch(`https://cloudflare-ipfs.com/ipfs/${uri.substr(37)}`)
      const data = await res.json()
      addToken({ tokenID: `${id}`, name: data.name, image: `https://cloudflare-ipfs.com/ipfs/${data.image.substr(37)}`, description: data.description, attributes: data.attributes })
    }
    const phunkyStakedCount = await _stakingContract.getTotalStakedItemsCount(0)
    const mushiesStakedCount = await _stakingContract.getTotalStakedItemsCount(1)
    stakeInfo.totalStaked = phunkyStakedCount.toNumber() + mushiesStakedCount.toNumber()
  } catch (err) {
    //
  }
}

const getKarmaInfo = async (account: string, provider: Web3Provider) => {
  const _karmaContract = new Contract(
    karmaContract.contractAddress,
    karmaContract.abi,
    provider
  )

  try {
    stakeInfo.karmaAmount = ethers.utils.formatEther(
      await _karmaContract.balanceOf(account)
    )
  } catch (err) {
    console.log(err)
  }
}

const updateClaimableReward = async (account: string, provider: Web3Provider) => {
  const _stakingContract = new Contract(
    stakingContract.contractAddress,
    stakingContract.abi,
    provider
  )

  try {
    const phunkyReward = await _stakingContract.totalClaimableReward(account, 0)
    const mushiesReward = await _stakingContract.totalClaimableReward(account, 1)
    stakeInfo.claimableReward = (parseInt(phunkyReward) + parseInt(mushiesReward)) / 10 ** 18
  } catch (err) {
    console.log(err)
  }
  return stakeInfo.claimableReward
}

const getWalletTokenInfo = (name: string) => {
  const [tokenName, tokenNumber] = name.split(' #')
  return {
    tokenName,
    tokenNumber
  }
}

export default reactive({
  tokens,
  balance,
  balanceChecked,
  stakeInfo,

  clearTokens,
  getWalletTokenInfo,
  getStakedNFTs,
  getKarmaInfo,
  updateClaimableReward
})
