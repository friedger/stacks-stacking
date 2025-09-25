import { StackingClient } from "@stacks/stacking";
import { client, createAccounts } from "./config";

const getStackingInfo = async () => {
  const { signer, poolAdmin, stacker } = await createAccounts();
  const c = new StackingClient({
    address: stacker.stxAddress,
    client,
    network: "devnet",
  });
  const info = await c.getAccountStatus();
  console.log(info);

  const status = await c.getStatus();
  console.log(status);

  console.log(signer, poolAdmin);
};

getStackingInfo();
