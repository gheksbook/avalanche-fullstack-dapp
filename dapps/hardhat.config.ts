import { task, type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";
import {USER_PRIVATE_KEY} from "./helpers/constants/deployments";



const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
     accounts: process.env.PRIVATE_KEY
  ? [process.env.PRIVATE_KEY]
  : [],

    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // apiKey: ETHERSCAN_API,
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true,
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();
  for (const account of accounts) {
    console.log(account.account.address);
  }
});
console.log("ENV COUNT:", Object.keys(process.env).length);
console.log("PK:", process.env.PRIVATE_KEY);
console.log("PK length:", process.env.PRIVATE_KEY?.length);

export default config;