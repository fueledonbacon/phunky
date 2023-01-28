import { computed, reactive, ref } from 'vue'
import { phunkyContract, mushiesContract, moralisApiKey } from '@/consts'

export type Token = {
  tokenID: string,
  name: string,
  image: string,
  description: string,
  attributes: { trait_type: string, value: string }[]
}

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

const getNFTs = async (account: string) => {
  try {
    const res_phunky = await fetch(
      `https://deep-index.moralis.io/api/v2/${account}/nft/${phunkyContract.contractAddress}?chain=mainnet&format=decimal`,
      {
        headers: {
          'x-api-key': moralisApiKey
        }
      }
    )
    const res_mushies = await fetch(
      `https://deep-index.moralis.io/api/v2/${account}/nft/${mushiesContract.contractAddress}?chain=mainnet&format=decimal`,
      {
        headers: {
          'x-api-key': moralisApiKey
        }
      }
    )
    const results_phunky = await res_phunky.json()
    for (const item of results_phunky.result) {
      const res = await fetch(item.token_uri)
      const data = await res.json()
      addToken({ tokenID: `${item.token_id}`, name: data.name, image: data.image, description: data.description, attributes: data.attributes })
    }
    const results_mushies = await res_mushies.json()
    for (const item of results_mushies.result) {
      const res = await fetch(item.token_uri)
      const data = await res.json()
      addToken({ tokenID: `${item.token_id}`, name: data.name, image: `https://cloudflare-ipfs.com/ipfs/${data.image.substr(37)}`, description: data.description, attributes: data.attributes })
    }
  } catch (err) {
    //
  }
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

  clearTokens,
  getWalletTokenInfo,
  getNFTs
})
