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

import {
	removeLiquidity,
	loadBalances,
	loadShares
} from '../store/interactions'

const Withdraw = () => {
	const [withdrawToken1, setWithdrawToken1] = useState(null)
	const [withdrawToken2, setWithdrawToken2] = useState(null)
	const [t1, setT1] = useState(null)
	const [t2, setT2] = useState(null)
	const [selectedAMM, setSelectedAMM] = useState(null)
	const [amount, setAmount] = useState(0)
	const [showAlert, setShowAlert] = useState(false)

	const provider = useSelector(state => state.provider.connection)
	const account = useSelector(state => state.provider.account)

	const tokens = useSelector(state => state.tokens.contracts)
	const symbols = useSelector(state => state.tokens.symbols)
	const balances = useSelector(state => state.tokens.balances)

	const amm = useSelector(state => state.amm.contract)
	const shares = useSelector(state => state.amm.shares)

	const isWithdrawing = useSelector(state => state.amm.withdrawing.isWithdrawing)
	const isSuccess = useSelector(state => state.amm.withdrawing.isSuccess)
	const transactionHash = useSelector(state => state.amm.withdrawing.transactionHash)

	const dispatch = useDispatch()

	const ammHandler = async () => {
		if (withdrawToken1 === symbols[0] && withdrawToken2 === symbols[3]) {
			setSelectedAMM(0)
			return
		}
		if (withdrawToken1 === symbols[1] && withdrawToken2 === symbols[3]) {
			setSelectedAMM(1)
			return
		}
		if (withdrawToken1 === symbols[1] && withdrawToken2 === symbols[0]) {
			setSelectedAMM(2)
			return
		}
		if (withdrawToken1 === symbols[2] && withdrawToken2 === symbols[3]) {
			setSelectedAMM(3)
			return
		}
		if (withdrawToken1 === symbols[2] && withdrawToken2 === symbols[1]) {
			setSelectedAMM(4)
			return
		}
		if (withdrawToken1 === symbols[2] && withdrawToken2 === symbols[0]) {
			setSelectedAMM(5)
			return
		}
	}

	const withdrawHandler = async (e) => {
		e.preventDefault()

		setShowAlert(false)

		const _shares = ethers.utils.parseUnits(amount, 'ether')

		await removeLiquidity(
			provider,
			amm[selectedAMM],
			_shares,
			dispatch
		)

		await loadShares(amm, account, dispatch)
		await loadBalances(tokens, account, dispatch)

		setShowAlert(true)

		setAmount(0)
	}

	useEffect(() => {
		ammHandler()
	}, [withdrawToken1, withdrawToken2])

	return (
		<div>
			<Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
				{account ? (
					<Form onSubmit={withdrawHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
						<Row>
							<Form.Text className='text-center my-2' muted>
								<p><strong>Withdraw Liquidity Pair</strong></p>
							</Form.Text>
							<InputGroup className='justify-content-center gap-2'>
								<DropdownButton
									variant="outline-secondary"
									title={withdrawToken1 ? withdrawToken1 : "Select Token"}
								>
									<Dropdown.Item onClick={(e) => (setWithdrawToken1(e.target.innerHTML), setT1(0))}>{symbols[0]}</Dropdown.Item>
									<Dropdown.Item onClick={(e) => (setWithdrawToken1(e.target.innerHTML), setT1(1))}>{symbols[1]}</Dropdown.Item>
									<Dropdown.Item onClick={(e) => (setWithdrawToken1(e.target.innerHTML), setT1(2))}>{symbols[2]}</Dropdown.Item>
								</DropdownButton>

								<DropdownButton
									variant="outline-secondary"
									title={withdrawToken2 ? withdrawToken2 : "Select Token"}
								>
									{withdrawToken1 === symbols[0] ? (
										<Dropdown.Item onClick={(e) => (setWithdrawToken2(e.target.innerHTML), setT2(3))}>{symbols[3]}</Dropdown.Item>
									) : withdrawToken1 === symbols[1] ? (
										<>
											<Dropdown.Item onClick={(e) => (setWithdrawToken2(e.target.innerHTML), setT2(0))}>{symbols[0]}</Dropdown.Item>
											<Dropdown.Item onClick={(e) => (setWithdrawToken2(e.target.innerHTML), setT2(3))}>{symbols[3]}</Dropdown.Item>
										</>
									) : withdrawToken1 === symbols[2] ? (
										<>
											<Dropdown.Item onClick={(e) => (setWithdrawToken2(e.target.innerHTML), setT2(0))}>{symbols[0]}</Dropdown.Item>
											<Dropdown.Item onClick={(e) => (setWithdrawToken2(e.target.innerHTML), setT2(1))}>{symbols[1]}</Dropdown.Item>
											<Dropdown.Item onClick={(e) => (setWithdrawToken2(e.target.innerHTML), setT2(3))}>{symbols[3]}</Dropdown.Item>
										</>
									) : (
										<>
										</>
									)}
								</DropdownButton>
							</InputGroup>
						</Row>

						<Row>
							<Form.Text className='text-end my-2' muted>
								Shares: {shares[selectedAMM]}
							</Form.Text>
							<InputGroup>
								<Form.Control
									type="number"
									placeholder="0"
									min="0.0"
									step="any"
									id="shares"
									onChange={(e) => setAmount(e.target.value)}
									value={amount === 0 ? "" : amount}
								/>
								<InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
									Shares
								</InputGroup.Text>
							</InputGroup>
						</Row>

						<Row className='my-3'>
							{isWithdrawing ? (
								<Spinner animation="border" style={{ display:'block', margin: '0 auto' }} />
							) : (
								<Button type='submit'>Withdraw</Button>
							)}
						</Row>

						<hr />

						<Row>
							{withdrawToken1 && withdrawToken2 ? (
								<>
									<p><strong>{withdrawToken1} Balance:</strong> {balances[t1]}</p>
									<p><strong>{withdrawToken2} Balance:</strong> {balances[t2]}</p>
								</>
							) : (
								<>
								</>
							)}
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

			{isWithdrawing ? (
				<Alert 
					message={"Withdraw Pending..."}
					transactionHash={null}
					variant={'info'}
					setShowAlert={setShowAlert}
				/>
			) : isSuccess && showAlert ? (
				<Alert 
					message={"Withdraw Successful!"}
					transactionHash={transactionHash}
					variant={'success'}
					setShowAlert={setShowAlert}
				/>
			) : !isSuccess && showAlert ? (
				<Alert 
					message={"Withdraw Failed."}
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

export default Withdraw;
