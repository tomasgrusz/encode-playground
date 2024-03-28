import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

const MINT_VALUE = parseEther("100");

async function main() {
  // Deploy contract
  const publicClient = await viem.getPublicClient();
  const [deployer, acc1, acc2] = await viem.getWalletClients();
  const contract = await viem.deployContract("MyToken");
  console.log(`Token contract deployed at ${contract.address}\n`);

  // Mint tokens
  const mintTx = await contract.write.mint([acc1.account.address, MINT_VALUE]);
  await publicClient.waitForTransactionReceipt({ hash: mintTx });
  console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${
      acc1.account.address
    }\n`
  );
  const balanceBN = await contract.read.balanceOf([acc1.account.address]);
  console.log(
    `Account ${acc1.account.address} has ${formatEther(
      balanceBN
    ).toString()} decimal units of MyToken\n`
  );

  // Check voting power
  const votes = await contract.read.getVotes([acc1.account.address]);
  console.log(
    `Account ${acc1.account.address} has ${formatEther(
      votes
    ).toString()} units of voting power before self delegating\n`
  );

  // Self delegate
  const delegateTx = await contract.write.delegate([acc1.account.address], {
    account: acc1.account,
  });
  await publicClient.waitForTransactionReceipt({ hash: delegateTx });
  const votesAfter = await contract.read.getVotes([acc1.account.address]);
  console.log(
    `Account ${acc1.account.address} has ${formatEther(
      votesAfter
    ).toString()} units of voting power after self delegating\n`
  );

  // Transfer tokens to another account
  const transferTx = await contract.write.transfer(
    [acc2.account.address, MINT_VALUE / 3n],
    {
      account: acc1.account,
    }
  );
  await publicClient.waitForTransactionReceipt({ hash: transferTx });
  const votes1AfterTransfer = await contract.read.getVotes([
    acc1.account.address,
  ]);
  console.log(
    `Account ${acc1.account.address} has ${formatEther(
      votes1AfterTransfer
    ).toString()} units of voting power after transferring\n`
  );
  const votes2AfterTransfer = await contract.read.getVotes([
    acc2.account.address,
  ]);
  console.log(
    `Account ${acc2.account.address} has ${formatEther(
      votes2AfterTransfer
    ).toString()} units of voting power after receiving a transfer\n`
  );

  // Account 2 self delegates
  const delegateTx2 = await contract.write.delegate([acc2.account.address], {
    account: acc2.account,
  });
  await publicClient.waitForTransactionReceipt({ hash: delegateTx2 });
  const votesAfter2 = await contract.read.getVotes([acc2.account.address]);
  console.log(
    `Account ${acc2.account.address} has ${formatEther(
      votesAfter2
    ).toString()} units of voting power after self delegating\n`
  );

  // Check voting power at past blocks for account 1
  const lastBlockNumber = await publicClient.getBlockNumber();
  for (let index = lastBlockNumber - 1n; index > 0n; index--) {
    const pastVotes = await contract.read.getPastVotes([
      acc1.account.address,
      index,
    ]);
    console.log(
      `Account ${acc1.account.address} had ${formatEther(
        pastVotes
      ).toString()} units of voting power at block ${index}\n`
    );
  }
}

main().catch(console.error);
