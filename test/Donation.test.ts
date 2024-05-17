import { ethers } from "hardhat"
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model"
import {Donation} from '../typechain-types/contracts/index'
import { assert,expect } from "chai"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { parseEther,formatEther } from "ethers"


const AMOUNT = parseEther('1');

describe('Donation', () => {
  let donation :  Donation, deployer:HardhatEthersSigner, donator:HardhatEthersSigner
  beforeEach(async () => {
    [deployer, donator] = (await ethers.getSigners())
    
    const donationFactory = await ethers.getContractFactory('Donation')
    donation = await donationFactory.deploy(deployer.address)
    await donation.waitForDeployment()
  })

  describe('constructor', () => {
    it('should set the owner', async () => {
      const owner = await donation.owner()
      assert.equal(owner, deployer.address)

    })
  })

  describe('donate', () => {
    it('should revert if send zero', async () => {
       await expect(donation.connect(donator)._donate({value : 0})).revertedWithCustomError(donation, 'Donation__CannotDonateWithZeroToken')
    })

    it('should update the balances', async () => {
      await donation.connect(donator)._donate({value : AMOUNT})
      const balance = await donation.getBalances()
      const contractBalance = await donation.getBalanceWithFnc()
      assert.equal(balance, AMOUNT)
      assert.equal(contractBalance, AMOUNT)
    })
  })


    describe('widthdraw', () => {
      it('should revert if not the owner', async () => {
        await expect(donation.connect(donator)._widthdraw()).to.be.revertedWith(`OwnableUnauthorizedcount`)
    })
  })

  it('should revert if no balance', async () => {
    await expect(donation._widthdraw()).to.be.revertedWith('Donation__NoBalanceToWidthdraw')
  })

  it('should updated balances after widthdraw', async () => {
    const deployerBalance = await deployer.provider.getBalance(deployer.address)
    await donation.connect(donator)._donate({value : AMOUNT})
    const tx = await donation.connect(deployer)._widthdraw()
    tx.wait(1)
    assert.equal(formatEther(await donation.getBalances()), '0.0' )
    assert.equal(formatEther(deployerBalance + AMOUNT), formatEther(await deployer.provider.getBalance(deployer.address)))
  })
})