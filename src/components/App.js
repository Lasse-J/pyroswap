import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'
import Card from 'react-bootstrap/Card';

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Swap from './Swap';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Charts from './Charts';

import { 
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadAMMPairs
} from '../store/interactions'

function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = await loadProvider(dispatch)

    // Load network
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // Fetch accounts
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(dispatch)
    })

    // Load tokens / contracts
    await loadTokens(provider, chainId, dispatch)
    await loadAMMPairs(provider, chainId, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return(
    <Container className="h-dvh">
      <HashRouter>

        <Card className="opacity-99 min-h-screen px-2 pb-2 mt-2">
         
          <Navigation />

        <hr />

        <Tabs />

        <Routes>
          <Route exact path="/" element={<Swap />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>

        </Card>
      </HashRouter>
    </Container>
  )
}

export default App;
