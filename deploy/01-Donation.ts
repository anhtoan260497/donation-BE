import hre from 'hardhat'
import { developmentChains } from '../network-hardhat-config';
import { verify } from '../utils/verify';
import { Address } from '../typechain-types';

const DonationDeployFnc = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const {log, deploy} = hre.deployments
    const chainId = await hre.getChainId()
    log('deploying Donation...')
    const Donation = await deploy('Donation', {
        from: deployer.address,
        args: [deployer.address],
        log: true
    })
    log(`Donation deployed to ${Donation.address}`)

    if(developmentChains.includes(chainId) || !process.env.VERIFY_API_KEY) return 

    verify(Donation.address, [deployer.address])

}

export default DonationDeployFnc