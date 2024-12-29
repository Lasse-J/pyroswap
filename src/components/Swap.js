import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Alert from './Alert';

import { swapT1, swapT2, loadBalances, loadShares } from '../store/interactions';

const Swap = () => {
	const [inputToken, setInputToken] = useState(null)
	const [outputToken, setOutputToken] = useState(null)
	const [inputAmount, setInputAmount] = useState(0)
	const [outputAmount, setOutputAmount] = useState(0)

	const [price, setPrice] = useState(0)

	const [showAlert, setShowAlert] = useState(false)

	const provider = useSelector(state => state.provider.connection)
	const account = useSelector(state => state.provider.account)

	const tokens = useSelector(state => state.tokens.contracts)
	const symbols = useSelector(state => state.tokens.symbols)
	const balances = useSelector(state => state.tokens.balances)

	const amm = useSelector(state => state.amm.contract)
	const isSwapping = useSelector(state => state.amm.swapping.isSwapping)
	const isSuccess = useSelector(state => state.amm.swapping.isSuccess)
	const transactionHash = useSelector(state => state.amm.swapping.transactionHash)

	const dispatch = useDispatch()

	const inputHandler = async (e) => {
		if (!inputToken || !outputToken) {
			window.alert("Please select token")
			return
		}

		if (inputToken === outputToken) {
			window.alert("Invalid token pair")
			return
		}

		if (inputToken === symbols[0] && outputToken === symbols[3]) {
			setInputAmount(e.target.value)
			const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[0].calculateToken1Swap(_token1Amount)
			const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token2Amount.toString())

			setPrice(await amm[0].token2Balance() / await amm[0].token1Balance())
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[0]) {
			setInputAmount(e.target.value)
			const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[0].calculateToken2Swap(_token2Amount)
			const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token1Amount.toString())

			setPrice(await amm[0].token1Balance() / await amm[0].token2Balance())
			return
		}
		if (inputToken === symbols[1] && outputToken === symbols[3]) {
			setInputAmount(e.target.value)
			const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[1].calculateToken1Swap(_token1Amount)
			const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token2Amount.toString())

			setPrice(await amm[1].token2Balance() / await amm[1].token1Balance())
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[1]) {
			setInputAmount(e.target.value)
			const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[1].calculateToken2Swap(_token2Amount)
			const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token1Amount.toString())

			setPrice(await amm[1].token1Balance() / await amm[1].token2Balance())
			return
		}		
		if (inputToken === symbols[1] && outputToken === symbols[0]) {
			setInputAmount(e.target.value)
			const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[2].calculateToken1Swap(_token1Amount)
			const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token2Amount.toString())

			setPrice(await amm[2].token2Balance() / await amm[2].token1Balance())
			return
		}
		if (inputToken === symbols[0] && outputToken === symbols[1]) {
			setInputAmount(e.target.value)
			const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[2].calculateToken2Swap(_token2Amount)
			const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token1Amount.toString())

			setPrice(await amm[2].token1Balance() / await amm[2].token2Balance())
			return
		}
		if (inputToken === symbols[2] && outputToken === symbols[3]) {
			setInputAmount(e.target.value)
			const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[3].calculateToken1Swap(_token1Amount)
			const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token2Amount.toString())

			setPrice(await amm[3].token2Balance() / await amm[3].token1Balance())
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[2]) {
			setInputAmount(e.target.value)
			const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[3].calculateToken2Swap(_token2Amount)
			const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token1Amount.toString())

			setPrice(await amm[3].token1Balance() / await amm[3].token2Balance())
			return
		}
		if (inputToken === symbols[2] && outputToken === symbols[1]) {
			setInputAmount(e.target.value)
			const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[4].calculateToken1Swap(_token1Amount)
			const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token2Amount.toString())

			setPrice(await amm[4].token2Balance() / await amm[4].token1Balance())
			return
		}
		if (inputToken === symbols[1] && outputToken === symbols[2]) {
			setInputAmount(e.target.value)
			const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[4].calculateToken2Swap(_token2Amount)
			const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token1Amount.toString())

			setPrice(await amm[4].token1Balance() / await amm[4].token2Balance())
			return
		}
		if (inputToken === symbols[2] && outputToken === symbols[0]) {
			setInputAmount(e.target.value)
			const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[5].calculateToken1Swap(_token1Amount)
			const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token2Amount.toString())

			setPrice(await amm[5].token2Balance() / await amm[5].token1Balance())
			return
		}
		if (inputToken === symbols[0] && outputToken === symbols[2]) {
			setInputAmount(e.target.value)
			const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[5].calculateToken2Swap(_token2Amount)
			const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')
			setOutputAmount(_token1Amount.toString())

			setPrice(await amm[5].token1Balance() / await amm[5].token2Balance())
			return
		}
	}

	const swapHandler = async (e) => {
		e.preventDefault()

		setShowAlert(false)

		if (inputToken === outputToken) {
			window.alert('Invalid Token Pair')
			return
		}

		// Formatting to wei value
		const _inputAmount = ethers.utils.parseUnits(inputAmount, 'ether')

		// Pair: wETH/USDC
		if (inputToken === symbols[0] && outputToken === symbols[3]) {
			await swapT1(provider, amm[0], tokens[0], inputToken, _inputAmount, dispatch)
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[0]) {
			await swapT2(provider, amm[0], tokens[3], inputToken, _inputAmount, dispatch)
			return
		}

		// Pair: wBTC/USDC
		if (inputToken === symbols[1] && outputToken === symbols[3]) {
			await swapT1(provider, amm[1], tokens[1], inputToken, _inputAmount, dispatch)
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[1]) {
			await swapT2(provider, amm[1], tokens[3], inputToken, _inputAmount, dispatch)
			return
		}

		// Pair: wBTC/wETH
		if (inputToken === symbols[1] && outputToken === symbols[0]) {
			await swapT1(provider, amm[2], tokens[1], inputToken, _inputAmount, dispatch)
			return
		}
		if (inputToken === symbols[0] && outputToken === symbols[1]) {
			await swapT2(provider, amm[2], tokens[0], inputToken, _inputAmount, dispatch)
			return
		}

		// Pair: PYRO/USDC
		if (inputToken === symbols[2] && outputToken === symbols[3]) {
			await swapT1(provider, amm[3], tokens[2], inputToken, _inputAmount, dispatch)
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[2]) {
			await swapT2(provider, amm[3], tokens[3], inputToken, _inputAmount, dispatch)
			return
		}

		// Pair: PYRO/wBTC
		if (inputToken === symbols[2] && outputToken === symbols[1]) {
			await swapT1(provider, amm[4], tokens[2], inputToken, _inputAmount, dispatch)
			return
		}
		if (inputToken === symbols[1] && outputToken === symbols[2]) {
			await swapT2(provider, amm[4], tokens[1], inputToken, _inputAmount, dispatch)
			return
		}

		// Pair: PYRO/wETH
		if (inputToken === symbols[2] && outputToken === symbols[0]) {
			await swapT1(provider, amm[5], tokens[2], inputToken, _inputAmount, dispatch)
			return
		}
		if (inputToken === symbols[0] && outputToken === symbols[2]) {
			await swapT2(provider, amm[5], tokens[0], inputToken, _inputAmount, dispatch)
			return
		}

		await loadBalances(tokens, account, dispatch)
		await loadShares(amm, account, dispatch)
		await getPrice()

		setShowAlert(true)
	}

	const getPrice = async () => {
		if (inputToken === outputToken) {
			setPrice(0)
			return
		}
		if (inputToken === symbols[0] && outputToken === symbols[3]) {
			setPrice(await amm[0].token2Balance() / await amm[0].token1Balance())
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[0]) {
			setPrice(await amm[0].token1Balance() / await amm[0].token2Balance())
			return
		}
		if (inputToken === symbols[1] && outputToken === symbols[3]) {
			setPrice(await amm[1].token2Balance() / await amm[1].token1Balance())
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[1]) {
			setPrice(await amm[1].token1Balance() / await amm[1].token2Balance())
			return
		}		
		if (inputToken === symbols[1] && outputToken === symbols[0]) {
			setPrice(await amm[2].token2Balance() / await amm[2].token1Balance())
			return
		}
		if (inputToken === symbols[0] && outputToken === symbols[1]) {
			setPrice(await amm[2].token1Balance() / await amm[2].token2Balance())
			return
		}
		if (inputToken === symbols[2] && outputToken === symbols[3]) {
			setPrice(await amm[3].token2Balance() / await amm[3].token1Balance())
			return
		}
		if (inputToken === symbols[3] && outputToken === symbols[2]) {
			setPrice(await amm[3].token1Balance() / await amm[3].token2Balance())
			return
		}
		if (inputToken === symbols[2] && outputToken === symbols[1]) {
			setPrice(await amm[4].token2Balance() / await amm[4].token1Balance())
			return
		}
		if (inputToken === symbols[1] && outputToken === symbols[2]) {
			setPrice(await amm[4].token1Balance() / await amm[4].token2Balance())
			return
		}
		if (inputToken === symbols[2] && outputToken === symbols[0]) {
			setPrice(await amm[5].token2Balance() / await amm[5].token1Balance())
			return
		}
		if (inputToken === symbols[0] && outputToken === symbols[2]) {
			setPrice(await amm[5].token1Balance() / await amm[5].token2Balance())
			return
		}
	}

	useEffect(() => {
		if(inputToken && outputToken) {
			getPrice()
		}		
	}, [inputToken, outputToken])

	return (
		<div>
			<Card style={{ maxWidth: '450px' }} className="mx-auto px-4">
				{account ? (
					<Form onSubmit={swapHandler} style={{ maxWidth: '450px', margin: '50px auto' }} >
						<Row className="my-3">
							<div className="d-flex justify-content-between">
								<Form.Label><strong>Input:</strong></Form.Label>
								<Form.Text muted>
									Balance: {
										inputToken === symbols[0] ? (
											balances[0]
										) : inputToken === symbols[1] ? (
											balances[1]
										) : inputToken === symbols[2] ? (
											balances[2]
										) : inputToken === symbols[3] ? (
											balances[3]
										) : 0
									}
								</Form.Text>
							</div>
							<InputGroup>
								<Form.Control 
									type="number"
									placeholder="0.0"
									min="0.0"
									step="any"
									onChange={(e) => inputHandler(e)}
									disabled={!inputToken}
								/>
								<DropdownButton
									variant="outline-secondary"
									title={inputToken ? inputToken : "Select Token"}
								>
									<Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)}>wETH</Dropdown.Item>
									<Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)}>wBTC</Dropdown.Item>
									<Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)}>PYRO</Dropdown.Item>
									<Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)}>USDC</Dropdown.Item>
								</DropdownButton>
							</InputGroup>
						</Row>

						<Row className="my-4">

							<div className="d-flex justify-content-between">
								<Form.Label><strong>Output:</strong></Form.Label>
								<Form.Text muted>
									Balance: {
										outputToken === symbols[0] ? (
											balances[0]
										) : outputToken === symbols[1] ? (
											balances[1]
										) : outputToken === symbols[2] ? (
											balances[2]
										) : outputToken === symbols[3] ? (
											balances[3]
										) : 0
									}
								</Form.Text>
							</div>
							<InputGroup>
								<Form.Control 
									type="number"
									placeholder="0.0"
									value={ outputAmount === 0 ? "" : outputAmount }
									disabled
								/>
								<DropdownButton
									variant="outline-secondary"
									title={outputToken ? outputToken : "Select Token"}
								>
									<Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>wETH</Dropdown.Item>
									<Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>wBTC</Dropdown.Item>
									<Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>PYRO</Dropdown.Item>
									<Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>USDC</Dropdown.Item>
								</DropdownButton>
							</InputGroup>

						</Row>

						<Row className="my-3">
							{isSwapping ? (
								<Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
							) : (
								<Button type="submit">Swap</Button>
							)}
							<Form.Text muted>Exchange Rate: {price}</Form.Text>
						</Row>

					</Form>
				) : (
					<p 
						className="d-flex justify-content-center align-items-center"
						style={{ height: '300px' }}
					>
						Please connect wallet.
					</p>
				)}
			</Card>

			{isSwapping ? (
				<Alert 
					message={"Swap Pending..."}
					transactionHash={null}
					variant={'info'}
					setShowAlert={setShowAlert}
				/>
			) : isSuccess && showAlert ? (
				<Alert 
					message={"Swap Successful!"}
					transactionHash={transactionHash}
					variant={'success'}
					setShowAlert={setShowAlert}
				/>
			) : !isSuccess && showAlert ? (
				<Alert 
					message={"Swap Failed."}
					transactionHash={null}
					variant={'danger'}
					setShowAlert={setShowAlert}
				/>
			) : (
				<></>
			)}
		</div>
	);
}

export default Swap;
