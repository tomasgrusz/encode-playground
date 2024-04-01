import * as dotenv from "dotenv";
import { parseEther, formatEther, toHex } from "viem";
import { abi } from "../../artifacts/contracts/MyToken.sol/MyToken.json";
import { createClients } from "../helpers";

dotenv.config();

const contractAddress = process.env.MYTOKEN_CONTRACT_ADDRESS as `0x${string}`;

async function mintTokens() {
  const { publicClient, deployer } = createClients();

  // Get command line arguments
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    throw new Error(
      "Usage: ts-node mintTokens.ts <recipient_address> <token_amount>"
    );
  }

  const recipientAddress = args[0];
  const tokenAmount = parseEther(args[1]);

  const tokenContractParameters = {
    address: contractAddress,
    abi: abi,
    functionName: "mint",
    args: [recipientAddress, tokenAmount],
  };

  try {
    const txResponse = await deployer.writeContract(tokenContractParameters);
    await publicClient.waitForTransactionReceipt({ hash: txResponse });
    console.log(`Tokens minted successfully to address ${recipientAddress}.`);
  } catch (error) {
    console.error("Failed to mint tokens:", error);
  }

  // Optionally, check and log the deployer's balance
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );
}

mintTokens().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
