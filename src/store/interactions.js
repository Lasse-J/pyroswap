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
	setAMMPairs,
	sharesLoaded,
	swapRequest,
	swapSuccess,
	swapFail,
	depositRequest,
	depositSuccess,
	depositFail
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

	dispatch(setAMMPairs([wethusdc, wbtcusdc, wbtcweth, pyrousdc, pyrowbtc, pyroweth]))

	return [wethusdc, wbtcusdc, wbtcweth, pyrousdc, pyrowbtc, pyroweth]
}


// ---------------------------------------------------------------------
// LOAD BALANCES

export const loadBalances = async (tokens, account, dispatch) => {
	const balance1 = await tokens[0].balanceOf(account)
	const balance2 = await tokens[1].balanceOf(account)
	const balance3 = await tokens[2].balanceOf(account)
	const balance4 = await tokens[3].balanceOf(account)

	dispatch(balancesLoaded([
		ethers.utils.formatUnits(balance1.toString(), 'ether'),
		ethers.utils.formatUnits(balance2.toString(), 'ether'),
		ethers.utils.formatUnits(balance3.toString(), 'ether'),
		ethers.utils.formatUnits(balance4.toString(), 'ether')
	]))	
}


// ---------------------------------------------------------------------
// LOAD SHARES

export const loadShares = async (amm, account, dispatch) => {
	const shares1 = await amm[0].shares(account)
	const shares2 = await amm[1].shares(account)
	const shares3 = await amm[2].shares(account)
	const shares4 = await amm[3].shares(account)
	const shares5 = await amm[4].shares(account)
	const shares6 = await amm[5].shares(account)
	
	dispatch(sharesLoaded([
		ethers.utils.formatUnits(shares1.toString(), 'ether'),
		ethers.utils.formatUnits(shares2.toString(), 'ether'),
		ethers.utils.formatUnits(shares3.toString(), 'ether'),
		ethers.utils.formatUnits(shares4.toString(), 'ether'),
		ethers.utils.formatUnits(shares5.toString(), 'ether'),
		ethers.utils.formatUnits(shares6.toString(), 'ether')
	]))
}

// ---------------------------------------------------------------------
// ADD LIQUIDITY

export const addLiquidity = async (provider, amm, tokens, amounts, dispatch) => {
	try {
		dispatch(depositRequest())
		const signer = await provider.getSigner()
		let transaction
		transaction = await tokens[0].connect(signer).approve(amm.address, amounts[0])
		await transaction.wait()
		transaction = await tokens[1].connect(signer).approve(amm.address, amounts[1])
		await transaction.wait()

		transaction = await amm.connect(signer).addLiquidity(amounts[0], amounts[1])
		await transaction.wait()

		dispatch(depositSuccess(transaction.hash))
	} catch (error) {
		dispatch(depositFail())
	}
}

// ---------------------------------------------------------------------
// SWAP

export const swapT1 = async (provider, amm, token, symbol, amount, dispatch) => {
	try {
		dispatch(swapRequest())

		let transaction
		const signer = await provider.getSigner()

		transaction = await token.connect(signer).approve(amm.address, amount)
		await transaction.wait()

		transaction = await amm.connect(signer).swapToken1(amount)
		await transaction.wait()

		dispatch(swapSuccess(transaction.hash))
	} catch (error) {
		dispatch(swapFail())
	}
}

export const swapT2 = async (provider, amm, token, symbol, amount, dispatch) => {
	try {
		dispatch(swapRequest())

		let transaction
		const signer = await provider.getSigner()

		transaction = await token.connect(signer).approve(amm.address, amount)
		await transaction.wait()

		transaction = await amm.connect(signer).swapToken2(amount)
		await transaction.wait()

		dispatch(swapSuccess(transaction.hash))
	} catch (error) {
		dispatch(swapFail())
	}
}
