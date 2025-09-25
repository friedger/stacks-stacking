import {
  broadcastTransaction,
  makeSTXTokenTransfer,
} from "@stacks/transactions";
import { client, createAccounts } from "./config";

const mineStacksBlock = async () => {
  const { deployer, signer } = await createAccounts();

  const transaction = await makeSTXTokenTransfer({
    recipient: signer.stxAddress,
    amount: 1,
    senderKey: deployer.privateKey,
    network: "devnet",
    client,
  });
  const result = await broadcastTransaction({
    transaction,
    network: "devnet",
    client,
  });
  console.log(result);
};

mineStacksBlock();
