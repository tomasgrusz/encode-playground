import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("Parameters not provided");
    const contractAddress = parameters[0];
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");
    const delegateAddress = parameters[1];
    if (!/^0x[a-fA-F0-9]{40}$/.test(delegateAddress))
        throw new Error("Invalid delegate address");

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const voter = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    console.log(`Delegating vote to address: ${delegateAddress}`);
    console.log("Confirm? (Y/n)");

    const stdin = process.openStdin();
    stdin.addListener("data", async function (d) {
        if (d.toString().trim().toLowerCase() !== "n") {
            const hash = await voter.writeContract({
                address: contractAddress as `0x${string}`,
                abi,
                functionName: "delegate",
                args: [delegateAddress as `0x${string}`],
            });
            console.log("Transaction hash:", hash);
            console.log("Waiting for confirmations...");
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log("Vote successfully delegated to:", delegateAddress);
        } else {
            console.log("Operation cancelled");
        }
        process.exit();
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
