import { StackingClient } from "@stacks/stacking";
import { createAccounts, client } from "./config";

const delegate = async () => {
  const { poolAdmin, stacker } = await createAccounts();

  const c = new StackingClient({
    address: stacker.stxAddress,
    client: client,
    network: "devnet",
  });
  const result = await c.delegateStx({
    amountMicroStx: 100_000_000_000_000n,
    lockPeriod: 1,
    delegateTo: poolAdmin.stxAddress,
    privateKey: stacker.privateKey,
  });
  console.log(result);
};

delegate();
