// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const config = require('../src/config.json')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens
const shares = ether

async function main() {
  
  // Fetch accounts
  console.log(`Fetching accounts and network \n`)
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const investor1 = accounts[1]
  const investor2 = accounts[2]
  const investor3 = accounts[3]
  const investor4 = accounts[4]

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork() // 31337 hardhat

  console.log(`Fetching tokens and transferring to accounts... \n`)

  // Fetch tokens
  const weth = await ethers.getContractAt('Token', config[chainId].weth.address)
  console.log(`wETH fetched: ${weth.address}`)

  const wbtc = await ethers.getContractAt('Token', config[chainId].wbtc.address)
  console.log(`wBTC fetched: ${wbtc.address}`)

  const pyro = await ethers.getContractAt('Token', config[chainId].pyro.address)
  console.log(`PYRO fetched: ${pyro.address}`)

  const usdc = await ethers.getContractAt('Token', config[chainId].usdc.address)
  console.log(`USDC fetched: ${usdc.address}`)


  //////////////////////////////////////////////////////
  // Distribute tokens to investors
  //

  let transaction

  // Send wETH to investors
  transaction = await weth.connect(deployer).transfer(investor1.address, tokens(100))
  await transaction.wait()

  transaction = await weth.connect(deployer).transfer(investor2.address, tokens(100))
  await transaction.wait()

  transaction = await weth.connect(deployer).transfer(investor3.address, tokens(100))
  await transaction.wait()

  transaction = await weth.connect(deployer).transfer(investor4.address, tokens(100))
  await transaction.wait()

  // Send wBTC to investors
  transaction = await wbtc.connect(deployer).transfer(investor1.address, tokens(10))
  await transaction.wait()

  transaction = await wbtc.connect(deployer).transfer(investor2.address, tokens(10))
  await transaction.wait()

  transaction = await wbtc.connect(deployer).transfer(investor3.address, tokens(10))
  await transaction.wait()

  transaction = await wbtc.connect(deployer).transfer(investor4.address, tokens(10))
  await transaction.wait()

  // Send PYRO to investors
  transaction = await pyro.connect(deployer).transfer(investor1.address, tokens(10000))
  await transaction.wait()

  transaction = await pyro.connect(deployer).transfer(investor2.address, tokens(10000))
  await transaction.wait()

  transaction = await pyro.connect(deployer).transfer(investor3.address, tokens(10000))
  await transaction.wait()

  transaction = await pyro.connect(deployer).transfer(investor4.address, tokens(10000))
  await transaction.wait()

  // Send USDC to investors
  transaction = await usdc.connect(deployer).transfer(investor1.address, tokens(1000000))
  await transaction.wait()

  transaction = await usdc.connect(deployer).transfer(investor2.address, tokens(1000000))
  await transaction.wait()

  transaction = await usdc.connect(deployer).transfer(investor3.address, tokens(1000000))
  await transaction.wait()

  transaction = await usdc.connect(deployer).transfer(investor4.address, tokens(1000000))
  await transaction.wait()

  console.log(`Distributed 1% of each token supply to each investor. \n`)

  //////////////////////////////////////////////////////
  // Adding liquidity
  //

  console.log(`Fetching AMM trading pairs... \n`)

  // Fetch AMM pairs
  const wethusdc = await ethers.getContractAt('AMM', config[chainId].wethusdc.address)
  console.log(`wETH/USDC AMM trading pair fetched: ${wethusdc.address}`)

  const wbtcusdc = await ethers.getContractAt('AMM', config[chainId].wbtcusdc.address)
  console.log(`wBTC/USDC AMM trading pair fetched: ${wbtcusdc.address}`)

  const wbtcweth = await ethers.getContractAt('AMM', config[chainId].wbtcweth.address)
  console.log(`wBTC/wETH AMM trading pair fetched: ${wbtcweth.address}`)

  const pyrousdc = await ethers.getContractAt('AMM', config[chainId].pyrousdc.address)
  console.log(`PYRO/USDC AMM trading pair fetched: ${pyrousdc.address}`)

  const pyrowbtc = await ethers.getContractAt('AMM', config[chainId].pyrowbtc.address)
  console.log(`PYRO/wBTC AMM trading pair fetched: ${pyrowbtc.address}`)

  const pyroweth = await ethers.getContractAt('AMM', config[chainId].pyroweth.address)
  console.log(`PYRO/wETH AMM trading pair fetched: ${pyroweth.address} \n`)

  // Providing liquidity (setting price)
  let amount1, amount2
  console.log(`Adding liquidity... \n`)

  // wETH/USDC ($4000)
  amount1 = tokens(3200)
  amount2 = tokens(12800000)
  transaction = await weth.connect(deployer).approve(wethusdc.address, amount1)
  await transaction.wait()
  transaction = await usdc.connect(deployer).approve(wethusdc.address, amount2)
  await transaction.wait()
  transaction = await wethusdc.connect(deployer).addLiquidity(amount1, amount2)
  await transaction.wait()
  console.log(`Provided liquidity for wETH/USDC, Initial Price set at ${amount2/amount1} USDC/wETH`)

  // wBTC/USDC ($100,000)
  amount1 = tokens(320)
  amount2 = tokens(32000000)
  transaction = await wbtc.connect(deployer).approve(wbtcusdc.address, amount1)
  await transaction.wait()
  transaction = await usdc.connect(deployer).approve(wbtcusdc.address, amount2)
  await transaction.wait()
  transaction = await wbtcusdc.connect(deployer).addLiquidity(amount1, amount2)
  await transaction.wait()
  console.log(`Provided liquidity for wBTC/USDC, Initial Price set at ${amount2/amount1} USDC/wBTC`)  

  // wBTC/wETH (25 ETH/BTC)
  amount1 = tokens(128)
  amount2 = tokens(3200)
  transaction = await wbtc.connect(deployer).approve(wbtcweth.address, amount1)
  await transaction.wait()
  transaction = await weth.connect(deployer).approve(wbtcweth.address, amount2)
  await transaction.wait()
  transaction = await wbtcweth.connect(deployer).addLiquidity(amount1, amount2)
  await transaction.wait()
  console.log(`Provided liquidity for wBTC/wETH, Initial Price set at ${amount2/amount1} wETH/wBTC`)

  // PYRO/USDC ($100)
  amount1 = tokens(32000)
  amount2 = tokens(3200000)
  transaction = await pyro.connect(deployer).approve(pyrousdc.address, amount1)
  await transaction.wait()
  transaction = await usdc.connect(deployer).approve(pyrousdc.address, amount2)
  await transaction.wait()
  transaction = await pyrousdc.connect(deployer).addLiquidity(amount1, amount2)
  await transaction.wait()
  console.log(`Provided liquidity for PYRO/USDC, Initial Price set at ${amount2/amount1} USDC/PYRO`)

  // PYRO/wBTC (0.001 BTC/PYRO)
  amount1 = tokens(32000)
  amount2 = tokens(32)
  transaction = await pyro.connect(deployer).approve(pyrowbtc.address, amount1)
  await transaction.wait()
  transaction = await wbtc.connect(deployer).approve(pyrowbtc.address, amount2)
  await transaction.wait()
  transaction = await pyrowbtc.connect(deployer).addLiquidity(amount1, amount2)
  await transaction.wait()
  console.log(`Provided liquidity for PYRO/wBTC, Initial Price set at ${amount2/amount1} wBTC/PYRO`)

  // PYRO/wETH (0.025 ETH/PYRO)
  amount1 = tokens(32000)
  amount2 = tokens(800)
  transaction = await pyro.connect(deployer).approve(pyroweth.address, amount1)
  await transaction.wait()
  transaction = await weth.connect(deployer).approve(pyroweth.address, amount2)
  await transaction.wait()
  transaction = await pyroweth.connect(deployer).addLiquidity(amount1, amount2)
  await transaction.wait()
  console.log(`Provided liquidity for PYRO/wETH, Initial Price set at ${amount2/amount1} wETH/PYRO \n`)


  //////////////////////////////////////////////////////
  // Swapping
  //

  // Investor 1 swaps
  console.log(`Investor 1 swaps... \n`)

  // Investor 1 approves all tokens
  transaction = await weth.connect(investor1).approve(wethusdc.address, tokens(100))
  await transaction.wait()
  transaction = await weth.connect(investor1).approve(wbtcweth.address, tokens(100))
  await transaction.wait()
  transaction = await weth.connect(investor1).approve(pyroweth.address, tokens(100))
  await transaction.wait()

  transaction = await wbtc.connect(investor1).approve(wbtcusdc.address, tokens(10))
  await transaction.wait()
  transaction = await wbtc.connect(investor1).approve(wbtcweth.address, tokens(10))
  await transaction.wait()
  transaction = await wbtc.connect(investor1).approve(pyrowbtc.address, tokens(10))
  await transaction.wait()

  transaction = await pyro.connect(investor1).approve(pyrousdc.address, tokens(10000))
  await transaction.wait()
  transaction = await pyro.connect(investor1).approve(pyroweth.address, tokens(10000))
  await transaction.wait()
  transaction = await pyro.connect(investor1).approve(pyrowbtc.address, tokens(10000))
  await transaction.wait()

  transaction = await usdc.connect(investor1).approve(wethusdc.address, tokens(1000000))
  await transaction.wait()
  transaction = await usdc.connect(investor1).approve(wbtcusdc.address, tokens(1000000))
  await transaction.wait()
  transaction = await usdc.connect(investor1).approve(pyrousdc.address, tokens(1000000))
  await transaction.wait()


  // Investor 1 swaps tokens
  transaction = await wethusdc.connect(investor1).swapToken1(tokens(1))
  await transaction.wait()
  transaction = await wbtcweth.connect(investor1).swapToken1(tokens(1))
  await transaction.wait()
  transaction = await pyroweth.connect(investor1).swapToken1(tokens(1000))
  await transaction.wait()
  transaction = await wbtcusdc.connect(investor1).swapToken1(tokens(1))
  await transaction.wait()
  transaction = await pyrowbtc.connect(investor1).swapToken1(tokens(1000))
  await transaction.wait()
  transaction = await pyrousdc.connect(investor1).swapToken1(tokens(1000))
  await transaction.wait()


  // Investor 2 swaps
  console.log(`Investor 2 swaps... \n`)


  // Investor 2 approves all tokens
  transaction = await weth.connect(investor2).approve(wethusdc.address, tokens(100))
  await transaction.wait()
  transaction = await weth.connect(investor2).approve(wbtcweth.address, tokens(100))
  await transaction.wait()
  transaction = await weth.connect(investor2).approve(pyroweth.address, tokens(100))
  await transaction.wait()

  transaction = await wbtc.connect(investor2).approve(wbtcusdc.address, tokens(10))
  await transaction.wait()
  transaction = await wbtc.connect(investor2).approve(wbtcweth.address, tokens(10))
  await transaction.wait()
  transaction = await wbtc.connect(investor2).approve(pyrowbtc.address, tokens(10))
  await transaction.wait()

  transaction = await pyro.connect(investor2).approve(pyrousdc.address, tokens(10000))
  await transaction.wait()
  transaction = await pyro.connect(investor2).approve(pyroweth.address, tokens(10000))
  await transaction.wait()
  transaction = await pyro.connect(investor2).approve(pyrowbtc.address, tokens(10000))
  await transaction.wait()

  transaction = await usdc.connect(investor2).approve(wethusdc.address, tokens(1000000))
  await transaction.wait()
  transaction = await usdc.connect(investor2).approve(wbtcusdc.address, tokens(1000000))
  await transaction.wait()
  transaction = await usdc.connect(investor2).approve(pyrousdc.address, tokens(1000000))
  await transaction.wait()


  // Investor 2 swaps tokens
  transaction = await wethusdc.connect(investor2).swapToken2(tokens(1000))
  await transaction.wait()
  transaction = await wbtcweth.connect(investor2).swapToken2(tokens(3))
  await transaction.wait()
  transaction = await pyroweth.connect(investor2).swapToken2(tokens(2))
  await transaction.wait()
  transaction = await wbtcusdc.connect(investor2).swapToken2(tokens(1000))
  await transaction.wait()
  transaction = await pyrowbtc.connect(investor2).swapToken2(tokens(1))
  await transaction.wait()
  transaction = await pyrousdc.connect(investor2).swapToken2(tokens(1000))
  await transaction.wait()



  // Investor 3 swaps
  console.log(`Investor 3 swaps... \n`)



  // Investor 3 approves all tokens
  transaction = await weth.connect(investor3).approve(wethusdc.address, tokens(100))
  await transaction.wait()
  transaction = await weth.connect(investor3).approve(wbtcweth.address, tokens(100))
  await transaction.wait()
  transaction = await weth.connect(investor3).approve(pyroweth.address, tokens(100))
  await transaction.wait()

  transaction = await wbtc.connect(investor3).approve(wbtcusdc.address, tokens(10))
  await transaction.wait()
  transaction = await wbtc.connect(investor3).approve(wbtcweth.address, tokens(10))
  await transaction.wait()
  transaction = await wbtc.connect(investor3).approve(pyrowbtc.address, tokens(10))
  await transaction.wait()

  transaction = await pyro.connect(investor3).approve(pyrousdc.address, tokens(10000))
  await transaction.wait()
  transaction = await pyro.connect(investor3).approve(pyroweth.address, tokens(10000))
  await transaction.wait()
  transaction = await pyro.connect(investor3).approve(pyrowbtc.address, tokens(10000))
  await transaction.wait()

  transaction = await usdc.connect(investor3).approve(wethusdc.address, tokens(1000000))
  await transaction.wait()
  transaction = await usdc.connect(investor3).approve(wbtcusdc.address, tokens(1000000))
  await transaction.wait()
  transaction = await usdc.connect(investor3).approve(pyrousdc.address, tokens(1000000))
  await transaction.wait()


  // Investor 3 swaps tokens
  transaction = await wethusdc.connect(investor3).swapToken1(tokens(3))
  await transaction.wait()
  transaction = await wbtcweth.connect(investor3).swapToken2(tokens(3))
  await transaction.wait()
  transaction = await pyroweth.connect(investor3).swapToken1(tokens(2000))
  await transaction.wait()
  transaction = await wbtcusdc.connect(investor3).swapToken2(tokens(5000))
  await transaction.wait()
  transaction = await pyrowbtc.connect(investor3).swapToken1(tokens(2500))
  await transaction.wait()
  transaction = await pyrousdc.connect(investor3).swapToken2(tokens(3000))
  await transaction.wait()


  // Investor 4 swaps
  console.log(`Investor 4 swaps... \n`)



  // Investor 4 approves all tokens
  transaction = await weth.connect(investor4).approve(wethusdc.address, tokens(100))
  await transaction.wait()
  transaction = await weth.connect(investor4).approve(wbtcweth.address, tokens(100))
  await transaction.wait()
  transaction = await weth.connect(investor4).approve(pyroweth.address, tokens(100))
  await transaction.wait()

  transaction = await wbtc.connect(investor4).approve(wbtcusdc.address, tokens(10))
  await transaction.wait()
  transaction = await wbtc.connect(investor4).approve(wbtcweth.address, tokens(10))
  await transaction.wait()
  transaction = await wbtc.connect(investor4).approve(pyrowbtc.address, tokens(10))
  await transaction.wait()

  transaction = await pyro.connect(investor4).approve(pyrousdc.address, tokens(10000))
  await transaction.wait()
  transaction = await pyro.connect(investor4).approve(pyroweth.address, tokens(10000))
  await transaction.wait()
  transaction = await pyro.connect(investor4).approve(pyrowbtc.address, tokens(10000))
  await transaction.wait()

  transaction = await usdc.connect(investor4).approve(wethusdc.address, tokens(1000000))
  await transaction.wait()
  transaction = await usdc.connect(investor4).approve(wbtcusdc.address, tokens(1000000))
  await transaction.wait()
  transaction = await usdc.connect(investor4).approve(pyrousdc.address, tokens(1000000))
  await transaction.wait()


  // Investor 4 swaps tokens
  transaction = await wethusdc.connect(investor4).swapToken2(tokens(3000))
  await transaction.wait()
  transaction = await wbtcweth.connect(investor4).swapToken1(tokens(1))
  await transaction.wait()
  transaction = await pyroweth.connect(investor4).swapToken2(tokens(2))
  await transaction.wait()
  transaction = await wbtcusdc.connect(investor4).swapToken1(tokens(1))
  await transaction.wait()
  transaction = await pyrowbtc.connect(investor4).swapToken2(tokens(1))
  await transaction.wait()
  transaction = await pyrousdc.connect(investor4).swapToken1(tokens(5000))
  await transaction.wait()


  console.log(`Finished. \n`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
