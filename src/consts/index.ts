import abi from '@/consts/abi.json'
export { default as NavLinks } from './nav-links.json'
export * from './chainId'

const {
  VITE_PHUNKY_CONTRACT_ADDRESS = '',
  VITE_MUSHIES_CONTRACT_ADDRESS = '',
  VITE_STAKING_CONTRACT_ADDRESS = '',
  VITE_KARMA_CONTRACT_ADDRESS = '',
  VITE_CHAIN_ID = '1',
  VITE_MORALIS_API_KEY = ''
} = import.meta.env

export const phunkyContract = {
  contractAddress: VITE_PHUNKY_CONTRACT_ADDRESS,
  chainId: VITE_CHAIN_ID,
  abi: abi.phunky
}

export const mushiesContract = {
  contractAddress: VITE_MUSHIES_CONTRACT_ADDRESS,
  chainId: VITE_CHAIN_ID,
  abi: abi.mushies
}

export const stakingContract = {
  contractAddress: VITE_STAKING_CONTRACT_ADDRESS,
  chainId: VITE_CHAIN_ID,
  abi: abi.staking
}

export const karmaContract = {
  contractAddress: VITE_KARMA_CONTRACT_ADDRESS,
  chainId: VITE_CHAIN_ID,
  abi: abi.karma
}

export const moralisApiKey = VITE_MORALIS_API_KEY

export const { MODE } = import.meta.env
