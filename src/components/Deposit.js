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

import { addLiquidity, loadBalances, loadShares } from '../store/interactions';

const Deposit = () => {
	const [token1, setToken1] = useState(null)
	const [token2, setToken2] = useState(null)
	const [token1Amount, setToken1Amount] = useState(0)
	const [token2Amount, setToken2Amount] = useState(0)
	const [selectedAMM, setSelectedAMM] = useState(0)
	const [selectedToken1, setSelectedToken1] = useState(0)
	const [selectedToken2, setSelectedToken2] = useState(0)
	const [showAlert, setShowAlert] = useState(false)

	const provider = useSelector(state => state.provider.connection)
	const account = useSelector(state => state.provider.account)

	const tokens = useSelector(state => state.tokens.contracts)
	const symbols = useSelector(state => state.tokens.symbols)
	const balances = useSelector(state => state.tokens.balances)
	
	const amm = useSelector(state => state.amm.contract)
	const shares = useSelector(state => state.amm.shares)

	const isDepositing = useSelector(state => state.amm.depositing.isDepositing)
	const isSuccess = useSelector(state => state.amm.depositing.isSuccess)
	const transactionHash = useSelector(state => state.amm.depositing.transactionHash)

	const dispatch = useDispatch()

	const ammHandler = async () => {
		if (token1 === 'wETH' && token2 === 'USDC') {
			setSelectedAMM(0)
			return
		}
		if (token1 === 'wBTC' && token2 === 'USDC') {
			setSelectedAMM(1)
			return
		}
		if (token1 === 'wBTC' && token2 === 'wETH') {
			setSelectedAMM(2)
			return
		}
		if (token1 === 'PYRO' && token2 === 'USDC') {
			setSelectedAMM(3)
			return
		}
		if (token1 === 'PYRO' && token2 === 'wBTC') {
			setSelectedAMM(4)
			return
		}
		if (token1 === 'PYRO' && token2 === 'wETH') {
			setSelectedAMM(5)
			return
		}
	}

	const token1Handler = async () => {
		if (token1 === 'wETH') {
			setSelectedToken1(0)
			return
		}
		if (token1 === 'wBTC') {
			setSelectedToken1(1)
			return
		}
		if (token1 === 'PYRO') {
			setSelectedToken1(2)
			return
		}
		if (token1 === 'USDC') {
			setSelectedToken1(3)
			return
		}
	}

	const token2Handler = async () => {
		if (token2 === 'wETH') {
			setSelectedToken2(0)
			return
		}
		if (token2 === 'wBTC') {
			setSelectedToken2(1)
			return
		}
		if (token2 === 'PYRO') {
			setSelectedToken2(2)
			return
		}
		if (token2 === 'USDC') {
			setSelectedToken2(3)
			return
		}
	}

	const amountHandler = async (e) => {
		if (e.target.id === 'token1') {
			setToken1Amount(e.target.value)

			const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[selectedAMM].calculateToken2Deposit(_token1Amount)
			const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')

			setToken2Amount(_token2Amount)
		} else {
			setToken2Amount(e.target.value)

			const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm[selectedAMM].calculateToken1Deposit(_token2Amount)
			const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')

			setToken1Amount(_token1Amount)
		}
	}

	const depositHandler = async (e) => {
		e.preventDefault()

		setShowAlert(false)

		const _token1Amount = ethers.utils.parseUnits(token1Amount, 'ether')
		const _token2Amount = ethers.utils.parseUnits(token2Amount, 'ether')

		await addLiquidity(
			provider, 
			amm[selectedAMM], 
			[tokens[selectedToken1], tokens[selectedToken2]], 
			[_token1Amount, _token2Amount], 
			dispatch
		)

		await loadBalances(tokens, account, dispatch)
		await loadShares(amm, account, dispatch)

		setShowAlert(true)

		setToken1Amount(0)
		setToken2Amount(0)
	}

	useEffect(() => {
		ammHandler()
		token1Handler()
		token2Handler()
	}, [token1, token2])

	return (
		<div>
			<Card style={{ maxWidth: '450px' }} className='content mx-auto px-4'>
				{account ? (
					<Form onSubmit={depositHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
						<Row>
							<Form.Text className='text-center my-2' muted>
								<p><strong>Deposit Liquidity Pair</strong></p>
							</Form.Text>
							<Form.Text className='text-end my-2' muted>
								Balance: {
									token1 === symbols[0] ? (
										balances[0]
									) : token1 === symbols[1] ? (
										balances[1]
									) : token1 === symbols[2] ? (
										balances[2]
									) : token1 === symbols[3] ? (
										balances[3]
									) : 0
								}
							</Form.Text>
							<InputGroup>
								<Form.Control
									type="number"
									placeholder="0.0"
									min="0.0"
									step="any"
									id="token1"
									onChange={(e) => amountHandler(e)}
									value={token1Amount === 0 ? "" : token1Amount}
								/>
								<DropdownButton
									variant="outline-secondary"
									title={token1 ? token1 : "Select Token"}
								>
									<Dropdown.Item onClick={(e) => setToken1(e.target.innerHTML)}>wETH</Dropdown.Item>
									<Dropdown.Item onClick={(e) => setToken1(e.target.innerHTML)}>wBTC</Dropdown.Item>
									<Dropdown.Item onClick={(e) => setToken1(e.target.innerHTML)}>PYRO</Dropdown.Item>
								</DropdownButton>
							</InputGroup>
						</Row>

						<Row className='my-3'>
							<Form.Text className='text-end my-2' muted>
								Balance: {
									token2 === symbols[0] ? (
										balances[0]
									) : token2 === symbols[1] ? (
										balances[1]
									) : token2 === symbols[2] ? (
										balances[2]
									) : token2 === symbols[3] ? (
										balances[3]
									) : 0
								}
							</Form.Text>
							<InputGroup>
								<Form.Control 
									type="number"
									placeholder="0.0"
									step="any"
									id="token2"
									onChange={(e) => amountHandler(e)}
									value={token2Amount === 0 ? "" : token2Amount}
								/>
								<DropdownButton
									variant="outline-secondary"
									title={token2 ? token2 : "Select Token"}
								>
									{token1 === 'wETH' ? (
										<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>USDC</Dropdown.Item>
									) : token1 === 'wBTC' ? (
										<>
											<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>wETH</Dropdown.Item>
											<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>USDC</Dropdown.Item>
										</>
									) : token1 === 'PYRO' ? (
										<>
											<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>wETH</Dropdown.Item>
											<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>wBTC</Dropdown.Item>
											<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>USDC</Dropdown.Item>
										</>
									) : (
										<>
											<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>wETH</Dropdown.Item>
											<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>wBTC</Dropdown.Item>
											<Dropdown.Item onClick={(e) => setToken2(e.target.innerHTML)}>USDC</Dropdown.Item>
										</>
									)}
								</DropdownButton>
							</InputGroup>
						</Row>

						<Row className='my-3'>
							{isDepositing ? (
								<Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
							) : (
								<Button variant="dark" type='submit'>Deposit</Button>
							)}
						</Row>

						<Row>
							<Form.Text className='my-1' muted>
								{token1 && token2 ? (
									<p>
									Shares: {shares[selectedAMM]}
									</p>
								) : (
									<></>
								)}
							</Form.Text>
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

			{isDepositing ? (
				<Alert 
					message={"Deposit Pending..."}
					transactionHash={null}
					variant={'info'}
					setShowAlert={setShowAlert}
				/>
			) : isSuccess && showAlert ? (
				<Alert 
					message={"Deposit Successful!"}
					transactionHash={transactionHash}
					variant={'success'}
					setShowAlert={setShowAlert}
				/>
			) : !isSuccess && showAlert ? (
				<Alert 
					message={"Deposit Failed."}
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

export default Deposit;
