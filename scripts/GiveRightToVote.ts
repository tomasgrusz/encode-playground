import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function giveRightToVote() {
    const parameters = process.argv.slice(2);
    if (parameters.length < 2)
        throw new Error("Parameters not provided. Usage: <contractAddress> <voterAddress>");
    
    const contractAddress = parameters[0] as `0x${string}`;
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");

    const voterAddress = parameters[1];
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
        throw new Error("Invalid voter address");

    try {
        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
        });

        const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
        const wallet = createWalletClient({
            account,
            chain: sepolia,
            transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
        });

        const hash = await wallet.writeContract({
            address: contractAddress,
            abi,
            functionName: "giveRightToVote",
            args: [voterAddress],
        });

        console.log(`Right to vote granted to ${voterAddress}`);
        console.log("Transaction hash:", hash);
    } catch (error) {
        console.error("Error:", error);
    }
}

giveRightToVote();

