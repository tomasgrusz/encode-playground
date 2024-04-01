import {
  toHex,
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  providerApiKey: process.env.ALCHEMY_API_KEY || "",
  deployerPrivateKey: process.env.PRIVATE_KEY || "",
  chain: sepolia,
};

export function createClients() {
  const httpTransport = http(
    `https://eth-sepolia.g.alchemy.com/v2/${config.providerApiKey}`
  );
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: httpTransport,
  });

  const account = privateKeyToAccount(`0x${config.deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: httpTransport,
  });
  console.log("Your address:", deployer.account.address);

  return { publicClient, deployer };
}
