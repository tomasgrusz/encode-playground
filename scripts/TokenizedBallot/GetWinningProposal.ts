import Web3 from "web3";
import * as dotenv from "dotenv";

import { abi } from "../../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { createClients } from "../helpers";
dotenv.config();

const contractAddress = process.env.TOKENIZED_BALLOT_ADDRESS as `0x${string}`;

async function main() {
  if (!contractAddress) throw new Error("Contract address not provided");

  const { publicClient } = createClients();

  try {
    const winnerName = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "winnerName",
    });

    console.log(
      `Winning proposal name: ${Web3.utils.hexToAscii(winnerName as string)}`
    );
  } catch (error) {
    console.error("Error fetching the winning proposal name:", error);
  }
}

main().catch(console.error);
