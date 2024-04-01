import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import {
  toHex,
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  abi,
  bytecode,
} from "../../artifacts/contracts/MyToken.sol/MyToken.json";
import { createClients } from "../helpers";

dotenv.config();

async function main() {
  const { publicClient, deployer } = createClients();

  // print the last block number
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  // print the deployer balance
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  // deploy the contract
  console.log("\nDeploying MyToken contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
  });
  console.log("Transaction hash:", hash);

  // wait for the transaction to be finalized
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("MyToken contract deployed to:", receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
