import * as dotenv from "dotenv";
import { toHex } from "viem";

// Import ABIs
import { abi as tokenizedBallotAbi } from "../../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { abi as myTokenAbi } from "../../artifacts/contracts/MyToken.sol/MyToken.json";
// Import the TokenizedBallot bytecode
import { bytecode as tokenizedBallotBytecode } from "../../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { createClients } from "../helpers";

dotenv.config();

const myTokenContractAddress = process.env.CONTRACT_ADDRESS || "";

async function deployTokenizedBallot() {
  const { publicClient, deployer } = createClients();

  // Command-line arguments for proposal names
  const args = process.argv.slice(2);
  if (args.length < 1) {
    throw new Error(
      "Usage: ts-node deployTokenizedBallot.ts <proposalName1> <proposalName2> ..."
    );
  }

  const proposalNamesBytes32 = args.map((name) => toHex(name, { size: 32 }));

  const currentBlockNumber = await publicClient.getBlockNumber();

  const snapshotBlockNumber = currentBlockNumber - 6n;

  console.log("Deploying TokenizedBallot contract...");
  const tokenizedBallotDeployment = await deployer.deployContract({
    abi: tokenizedBallotAbi,
    bytecode: tokenizedBallotBytecode as `0x${string}`,
    args: [proposalNamesBytes32, myTokenContractAddress, snapshotBlockNumber],
  });

  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: tokenizedBallotDeployment,
  });
  console.log("TokenizedBallot contract deployed to:", receipt.contractAddress);
}

deployTokenizedBallot().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
