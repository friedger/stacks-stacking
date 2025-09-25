import { StackingClient } from "@stacks/stacking";
import { createAccounts, client } from "./config";

const commit = async () => {
  const { signer, poolAdmin, stacker } = await createAccounts();

  const c = new StackingClient({
    address: poolAdmin.stxAddress,
    client: client,
    network: "devnet",
  });
  const poxInfo = await c.getPoxInfo();
  const info = await c.getCoreInfo();

  let result = await c.delegateStackStx({
    stacker: stacker.stxAddress,
    amountMicroStx: 90_000_000_000_000n,
    poxAddress: poolAdmin.btcAddress,
    burnBlockHeight: info.burn_block_height + 1,
    cycles: 1,
    privateKey: poolAdmin.privateKey,
  });
  console.log(result);
  const poxAddress = poolAdmin.btcAddress;
  console.log("Using pox address: ", poxAddress);

  const rewardCycle = poxInfo.reward_cycle_id + 1;
  const signerKey = signer.publicKey;
  const authId = 1;
  const maxAmount = 100_000_000_000_000n;
  const signerSignature = c.signPoxSignature({
    topic: "agg-commit",
    authId,
    poxAddress,
    rewardCycle,
    period: 1,
    signerPrivateKey: signer.privateKey,
    maxAmount,
  });

  result = await c.stackAggregationCommitIndexed({
    poxAddress,
    rewardCycle,
    signerKey,
    signerSignature,
    maxAmount,
    authId,
    privateKey: poolAdmin.privateKey,
  });
  console.log(result);
};
commit();
