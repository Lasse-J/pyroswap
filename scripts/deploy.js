// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Deploy Tokens
  const Token = await hre.ethers.getContractFactory('Token')

  // wETH
  const weth = await Token.deploy('Wrapped Ether', 'wETH', '10000') // 10,000 Wrapped Ether
  await weth.deployed()
  console.log(`Wrapped Ether deployed to: ${weth.address}\n`)

  // wBTC
  const wbtc = await Token.deploy('Wrapped Bitcoin', 'wBTC', '1000') // 1000 Wrapped Bitcoin
  await wbtc.deployed()
  console.log(`Wrapped Bitcoin deployed to: ${wbtc.address}\n`)

  // PYRO
  const pyro = await Token.deploy('Pyro Token', 'PYRO', '1000000') // 1 Million Pyro Tokens
  await pyro.deployed()
  console.log(`Pyro Token deployed to: ${pyro.address}\n`)

  // USDC
  const usdc = await Token.deploy('USD Coin', 'USDC', '100000000') // 100 Million USDC
  await usdc.deployed()
  console.log(`USD Coin deployed to: ${usdc.address}\n`)

  // Deploy AMM Pairs
  const AMM = await hre.ethers.getContractFactory('AMM')

  // wETH/USDC
  const wethusdc = await AMM.deploy(weth.address, usdc.address)
  await wethusdc.deployed()
  console.log(`wETH/USDC pair amm deployed to: ${wethusdc.address}\n`)

  // wBTC/USDC
  const wbtcusdc = await AMM.deploy(wbtc.address, usdc.address)
  await wbtcusdc.deployed()
  console.log(`wBTC/USDC pair amm deployed to: ${wbtcusdc.address}\n`)

  // wBTC/wETH
  const wbtcweth = await AMM.deploy(wbtc.address, weth.address)
  await wbtcweth.deployed()
  console.log(`wBTC/wETH pair amm deployed to: ${wbtcweth.address}\n`)

  // PYRO/USDC
  const pyrousdc = await AMM.deploy(pyro.address, usdc.address)
  await pyrousdc.deployed()
  console.log(`PYRO/USDC pair amm deployed to: ${pyrousdc.address}\n`)

  // PYRO/wBTC
  const pyrowbtc = await AMM.deploy(pyro.address, wbtc.address)
  await pyrowbtc.deployed()
  console.log(`PYRO/wBTC pair amm deployed to: ${pyrowbtc.address}\n`)

  // PYRO/wETH
  const pyroweth = await AMM.deploy(pyro.address, weth.address)
  await pyroweth.deployed()
  console.log(`PYRO/wETH pair amm deployed to: ${pyroweth.address}\n`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
