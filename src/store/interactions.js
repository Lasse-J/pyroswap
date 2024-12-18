import { ethers } from 'ethers'

import { 
	setProvider,
	setNetwork,
	setAccount 
} from './reducers/provider'

import { 
	setContracts,
	setSymbols,
	balancesLoaded
} from './reducers/tokens'

import { 
	setAMMPair
} from './reducers/amm'

import TOKEN_ABI from '../abis/Token.json'
import AMM_ABI from '../abis/AMM.json'
import config from '../config.json'

export const loadProvider = (dispatch) => {
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	dispatch(setProvider(provider))

	return provider
}

export const loadNetwork = async (provider, dispatch) => {
	const { chainId } = await provider.getNetwork()
	dispatch(setNetwork(chainId))

	return chainId 
}

export const loadAccount = async (dispatch) => {
	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
	const account = ethers.utils.getAddress(accounts[0])
	dispatch(setAccount(account))

	return account
}

// ---------------------------------------------------------------------
// LOAD CONTRACTS

export const loadTokens = async (provider, chainId, dispatch) => {
	const weth = new ethers.Contract(config[chainId].weth.address, TOKEN_ABI, provider)
	const wbtc = new ethers.Contract(config[chainId].wbtc.address, TOKEN_ABI, provider)
	const pyro = new ethers.Contract(config[chainId].pyro.address, TOKEN_ABI, provider)
	const usdc = new ethers.Contract(config[chainId].usdc.address, TOKEN_ABI, provider)

	dispatch(setContracts([weth, wbtc, pyro, usdc]))
	dispatch(setSymbols([await weth.symbol(), await wbtc.symbol(), await pyro.symbol(), await usdc.symbol()]))
}

export const loadAMMPairs = async (provider, chainId, dispatch) => {
	const wethusdc = new ethers.Contract(config[chainId].wethusdc.address, AMM_ABI, provider)
	const wbtcusdc = new ethers.Contract(config[chainId].wbtcusdc.address, AMM_ABI, provider)
	const wbtcweth = new ethers.Contract(config[chainId].wbtcweth.address, AMM_ABI, provider)
	const pyrousdc = new ethers.Contract(config[chainId].pyrousdc.address, AMM_ABI, provider)
	const pyrowbtc = new ethers.Contract(config[chainId].pyrowbtc.address, AMM_ABI, provider)
	const pyroweth = new ethers.Contract(config[chainId].pyroweth.address, AMM_ABI, provider)

	dispatch(setAMMPair([wethusdc, wbtcusdc, wbtcweth, pyrousdc, pyrowbtc, pyroweth]))

	return [wethusdc, wbtcusdc, wbtcweth, pyrousdc, pyrowbtc, pyroweth]
}


// ---------------------------------------------------------------------
// LOAD BALANCES & SHARES

export const loadBalances = async (tokens, account, dispatch) => {
	const balance1 = await tokens[0].balanceOf(account)
	const balance2 = await tokens[1].balanceOf(account)
	const balance3 = await tokens[2].balanceOf(account)
	const balance4 = await tokens[3].balanceOf(account)

	dispatch(balancesLoaded(
		balance1,
		balance2,
		balance3,
		balance4
	))
}
