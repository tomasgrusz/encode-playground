import { sepolia } from "viem/chains";
import Web3 from 'web3';
import * as dotenv from "dotenv";
import { createPublicClient, http } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const contractAddress = process.argv[2];

async function main() {
    if (!contractAddress) throw new Error("Contract address not provided");

    const publicClient = createPublicClient({
        chain: sepolia, // Adjust the chain accordingly
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    try {
        const winnerName = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi,
            functionName: "winnerName",
        });

        console.log(`Winning proposal name: ${Web3.utils.hexToAscii(winnerName as string)}`);

    } catch (error) {
        console.error("Error fetching the winning proposal name:", error);
    }
}

main().catch(console.error);
