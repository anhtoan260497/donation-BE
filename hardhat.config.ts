import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy'

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  namedAccounts :{
    deployer : {
      default : 0
    },
    donator : {
      default : 1
    }
  }
};

export default config;
