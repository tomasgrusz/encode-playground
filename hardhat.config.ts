// Import necessary types and functions from the Hardhat framework.
import { HardhatUserConfig, task } from "hardhat/config";
// Import a specific Hardhat plugin named `hardhat-toolbox-viem`, presumably offering additional tools or functionalities.
import "@nomicfoundation/hardhat-toolbox-viem";
import { configDotenv } from "dotenv";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

// Define the configuration for the Hardhat project using the `HardhatUserConfig` interface.
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    }
  },
};

// Make the `config` object the default export of this module, allowing it to be used in other parts of the Hardhat project.
export default config;

// Define a new Hardhat task named "accounts" which prints a list of accounts.
task("accounts", "Prints the list of accounts", async (args, hre) => {
  // Use the Hardhat Runtime Environment (`hre`) to access the `viem` plugin's functionality.
  // Call `getWalletClients` to asynchronously retrieve a list of wallet clients (accounts).
  const accounts = await hre.viem.getWalletClients();
  // Iterate over each account in the list of accounts.
  // Log the Ethereum address of each account to the console.
  for (const account of accounts) {
    console.log(account.account.address)
  }
});
