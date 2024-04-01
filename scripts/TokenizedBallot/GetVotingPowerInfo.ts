import * as dotenv from "dotenv";
import { abi as TokenizedBallotAbi } from "../../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { abi as MyTokenAbi } from "../../artifacts/contracts/MyToken.sol/MyToken.json";

import { formatEther } from "viem";
import { createClients } from "../helpers";

dotenv.config();

const contractAddressBallot = process.env
  .TOKENIZED_BALLOT_ADDRESS as `0x${string}`;
const contractAddressToken = process.env
  .MYTOKEN_CONTRACT_ADDRESS as `0x${string}`;

async function main() {
  if (!contractAddressBallot) throw new Error("Contract address not provided");

  const addressToCheck = process.argv[2];
  if (!addressToCheck || !/^0x[a-fA-F0-9]{40}$/.test(addressToCheck))
    throw new Error("Usage: ts-node GetVotingPower.ts <address>");

  const { publicClient } = createClients();

  try {
    const snapshotBlockNumber = await publicClient.readContract({
      address: contractAddressBallot as `0x${string}`,
      abi: TokenizedBallotAbi,
      functionName: "targetBlockNumber",
    });

    const votePowerAvailable = await publicClient.readContract({
      address: contractAddressToken as `0x${string}`,
      abi: MyTokenAbi,
      functionName: "getPastVotes",
      args: [addressToCheck as `0x${string}`, snapshotBlockNumber as number],
    });
    console.log(
      `Vote power available at block ${snapshotBlockNumber}: ${formatEther(
        votePowerAvailable as bigint
      )}`
    );

    const votePowerSpent = await publicClient.readContract({
      address: contractAddressBallot as `0x${string}`,
      abi: TokenizedBallotAbi,
      functionName: "votePowerSpent",
      args: [addressToCheck as `0x${string}`],
    });
    console.log(`Vote power spent: ${formatEther(votePowerSpent as bigint)}`);
  } catch (error) {
    console.error("Error fetching the spent vote power:", error);
  }
}

main().catch(console.error);
