import { sepolia } from "viem/chains";
import { hexToString, createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {

    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("Parameters not provided");

    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");

    const proposalIndex = parameters[1];
    if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

    const providerApiKey = process.env.ALCHEMY_API_KEY || "";
    const voterPrivateKey = process.env.PRIVATE_KEY || "";
    
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    console.log("Proposal selected: ");

    const proposal = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "proposals",
        args: [BigInt(proposalIndex)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log("Voting to proposal", name);
    console.log("Confirm? (Y/n)");

    const account = privateKeyToAccount(`0x${voterPrivateKey}`);
    
    const voter = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    
    const stdin = process.openStdin();
    const voter2 = 
        stdin.addListener("data", async function (d) {
        
        if (d.toString().trim().toLowerCase() != "n") {
            const hash = await voter.writeContract({
                address: contractAddress,
                abi,
                functionName: "vote",
                args: [BigInt(proposalIndex)],
            });
            console.log("Transaction hash:", hash);
            console.log("Waiting for confirmations...");
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log("Transaction confirmed");
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