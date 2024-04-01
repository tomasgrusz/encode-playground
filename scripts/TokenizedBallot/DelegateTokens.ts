import * as dotenv from "dotenv";
import { parseEther } from "viem";

import { abi } from "../../artifacts/contracts/MyToken.sol/MyToken.json";
import { createClients } from "../helpers";

dotenv.config();
const contractAddress = process.env.MYTOKEN_CONTRACT_ADDRESS as `0x${string}`;

async function delegateTokens() {
  const { publicClient, deployer } = createClients();

  // command line arguments
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    throw new Error("Usage: ts-node delegateTokens.ts <delegate_address>");
  }
  const delegateAddress = args[0];
  if (!/^0x[a-fA-F0-9]{40}$/.test(delegateAddress))
    throw new Error("Invalid delegate address");

  // call delegate function
  const tokenContractParameters = {
    address: contractAddress,
    abi: abi,
    functionName: "delegate",
    args: [delegateAddress as `0x${string}`],
  };

  try {
    const txResponse = await deployer.writeContract(tokenContractParameters);
    await publicClient.waitForTransactionReceipt({ hash: txResponse });
    console.log(`Voting power successfully delegated to ${delegateAddress}.`);
  } catch (error) {
    console.error("Failed to delegate tokens:", error);
  }
}

delegateTokens().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
