import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import Loading from './Loading';

import {
	loadAllSwaps
} from '../store/interactions'

const Charts = () => {
	const [selectedAMM, setSelectedAMM] = useState(0)
	const [selectedToken1, setSelectedToken1] = useState(null)
	const [selectedToken2, setSelectedToken2] = useState(null)
	const [t1, setT1] = useState(0)
	const [t2, setT2] = useState(3)
	const [isLoading, setIsLoading] = useState(false)

	const provider = useSelector(state => state.provider.connection)

	const tokens = useSelector(state => state.tokens.contracts)
	const symbols = useSelector(state => state.tokens.symbols)
	
	const amm = useSelector(state => state.amm.contract)
	const swaps = useSelector(state => state.amm.swaps)

	const dispatch = useDispatch()

	const token1SelectHandler = async (token, index) => {
		setIsLoading(true);
		setSelectedToken1(token);
		setT1(index);
	}

	const token2SelectHandler = async (token, index) => {
		setIsLoading(true);
		setSelectedToken2(token);
		setT2(index);
	}

	const selectAMMHandler = async () => {
		let ammIndex = null;

		if (selectedToken1 === symbols[0] && selectedToken2 === symbols[3]) {
			ammIndex = 0;
		} else if (selectedToken1 === symbols[1] && selectedToken2 === symbols[3]) {
			ammIndex = 1;
		} else if (selectedToken1 === symbols[1] && selectedToken2 === symbols[0]) {
			ammIndex = 2;
		} else if (selectedToken1 === symbols[2] && selectedToken2 === symbols[3]) {
			ammIndex = 3;
		} else if (selectedToken1 === symbols[2] && selectedToken2 === symbols[1]) {
			ammIndex = 4;
		} else if (selectedToken1 === symbols[2] && selectedToken2 === symbols[0]) {
			ammIndex = 5;
		}

		if (ammIndex !== null) {
			setSelectedAMM(ammIndex);

			if (provider && amm) {
				await loadAllSwaps(provider, amm[ammIndex], dispatch);
			}
		}
		setIsLoading(false);
	}

	useEffect(() => {
		if (provider && amm && selectedAMM !== null) {
			setIsLoading(true);
			loadAllSwaps(provider, amm[selectedAMM], dispatch).finally(() => setIsLoading(false));
		}
	}, [provider, amm, selectedAMM, dispatch])

	return (
		<div>
			<Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
				<Form onSubmit={selectAMMHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
					<Row>
						<Form.Text className='text-center my-2' muted>
							<p><strong>Select Trading Pair</strong></p>
						</Form.Text>
						<InputGroup className='justify-content-center gap-2'>
							<DropdownButton
								variant="outline-secondary"
								title={selectedToken1 ? selectedToken1 : "Select Token"}
							>
								<Dropdown.Item onClick={() => token1SelectHandler(symbols[0], 0)}>{symbols[0]}</Dropdown.Item>
								<Dropdown.Item onClick={() => token1SelectHandler(symbols[1], 1)}>{symbols[1]}</Dropdown.Item>
								<Dropdown.Item onClick={() => token1SelectHandler(symbols[2], 2)}>{symbols[2]}</Dropdown.Item>
							</DropdownButton>

							<DropdownButton
								variant="outline-secondary"
								title={selectedToken2 ? selectedToken2 : "Select Token"}
							>
								{selectedToken1 === symbols[0] ? (
									<Dropdown.Item onClick={() => token2SelectHandler(symbols[3], 3)}>{symbols[3]}</Dropdown.Item>
								) : selectedToken1 === symbols[1] ? (
									<>
										<Dropdown.Item onClick={() => token2SelectHandler(symbols[0], 0)}>{symbols[0]}</Dropdown.Item>
										<Dropdown.Item onClick={() => token2SelectHandler(symbols[3], 3)}>{symbols[3]}</Dropdown.Item>
									</>
								) : selectedToken1 === symbols[2] ? (
									<>
										<Dropdown.Item onClick={() => token2SelectHandler(symbols[0], 0)}>{symbols[0]}</Dropdown.Item>
										<Dropdown.Item onClick={() => token2SelectHandler(symbols[1], 1)}>{symbols[1]}</Dropdown.Item>
										<Dropdown.Item onClick={() => token2SelectHandler(symbols[3], 3)}>{symbols[3]}</Dropdown.Item>
									</>
								) : (
									<>
									</>
								)}
							</DropdownButton>
						<Button type='submit'>Load data</Button>
						</InputGroup>
					</Row>
				</Form>
			</Card>

			{isLoading ? (
				<Loading />
			) : (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Transaction Hash</th>
							<th>Token Give</th>
							<th>Amount Give</th>
							<th>Token Get</th>
							<th>Amount Get</th>
							<th>User</th>
							<th>Time</th>
						</tr>
					</thead>
					<tbody>
						{swaps && swaps.map((swap, index) => (
							<tr key={index}>
								<td>{swap.hash.slice(0, 5) + '...' + swap.hash.slice(-5)}</td>
								<td>{swap.args.tokenGive === tokens[t1].address ? symbols[t1] : symbols[t2]}</td>
								<td>{ethers.utils.formatUnits(swap.args.tokenGiveAmount.toString(), 'ether')}</td>
								<td>{swap.args.tokenGet === tokens[t1].address ? symbols[t1] : symbols[t2]}</td>
								<td>{ethers.utils.formatUnits(swap.args.tokenGetAmount.toString(), 'ether')}</td>
								<td>{swap.args.user.slice(0, 5) + '...' + swap.args.user.slice(-4)}</td>
								<td>{
									new Date(Number(swap.args.timestamp.toString() + '000'))
										.toLocaleDateString(
											undefined,
											{
												year: 'numeric',
												month: 'short',
												day: 'numeric',
												hour: 'numeric',
												minute: 'numeric',
												second: 'numeric'
											}
										)
								}</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>

	);
}

export default Charts;
