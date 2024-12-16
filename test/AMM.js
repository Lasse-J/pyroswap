const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('AMM', () => {
  let accounts,
      deployer,
      liqudityProvider

  let token1,
      token2,
      amm

  beforeEach(async () => {
    // Setup Accounts
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    liqudityProvider = accounts[1]

    // Deploy Tokens
    const Token = await ethers.getContractFactory('Token')
    token1 = await Token.deploy('Wrapped Ether', 'wETH', '10000') // 10k
    token2 = await Token.deploy('USD Coin', 'USDC', '1000000') // 1M

    // Distribute Tokens
    let transaction = await token1.connect(deployer).transfer(liqudityProvider.address, tokens(1000))
    await transaction.wait()

    transaction = await token2.connect(deployer).transfer(liqudityProvider.address, tokens(100000))
    await transaction.wait()

    // Deploy AMM Pair
    const AMM = await ethers.getContractFactory('AMM')
    amm = await AMM.deploy(token1.address, token2.address)
  })

  describe('Deployment', () => {

    it('has an address', async () => {
      expect(amm.address).to.not.equal(0x0)
    })

    it('tracks token1 address', async () => {
      expect(await amm.token1()).to.equal(token1.address)
    })

    it('tracks token2 address', async () => {
      expect(await amm.token2()).to.equal(token2.address)
    })

  })

  describe('Adding liquidity', () => {

    it('has an address', async () => {

    })

  })

  describe('Swapping tokens', () => {
    let amount1, amount2, transaction, result

    it('facilitates swaps', async () => {
      // Deployer approves tokens
      amount1 = tokens(1000)
      transaction = await token1.connect(deployer).approve(amm.address, amount1)
      await transaction.wait()

      amount2 = tokens(100000)
      transaction = await token2.connect(deployer).approve(amm.address, amount2)
      await transaction.wait()

      // Deployer adds liquidity
      transaction = await amm.connect(deployer).addLiquidity(amount1, amount2)
      await transaction.wait()

      // Check AMM receives tokens
      expect(await token1.balanceOf(amm.address)).to.equal(amount1)
      expect(await token2.balanceOf(amm.address)).to.equal(amount2)

      expect(await amm.token1Balance()).to.equal(amount1)
      expect(await amm.token2Balance()).to.equal(amount2)

      // Check deployer has 100 shares
      expect(await amm.shares(deployer.address)).to.equal(tokens(100)) // tokens helper to calculate shares

      // Check pool has 100 total shares
      expect(await amm.totalShares()).to.equal(tokens(100))


      ////////////////////////////////////////////////////////
      // LP adds more liquidity
      //

      // LP approves tokens
      amount1 = tokens(500)
      transaction = await token1.connect(liqudityProvider).approve(amm.address, amount1)
      await transaction.wait()

      amount2 = tokens(50000)
      transaction = await token2.connect(liqudityProvider).approve(amm.address, amount2)
      await transaction.wait()

      // Calculate token2 deposit amount
      let token2Deposit = await amm.calculateToken2Deposit(amount1)

      // LP adds liquidity
      transaction = await amm.connect(liqudityProvider).addLiquidity(amount1, token2Deposit)
      await transaction.wait()

      // LP should have 50 shares
      expect(await amm.shares(liqudityProvider.address)).to.equal(tokens(50))

      // Deployer should still have 100 shares
      expect(await amm.shares(deployer.address)).to.equal(tokens(100))

      // Pool should have 150 total shares
      expect(await amm.totalShares()).to.equal(tokens(150))
    })

  })

})
