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

  const poxAddress = stacker.btcAddress;
  console.log("Using pox address: ", poxAddress);

  let result = await c.delegateStackExtend({
    stacker: stacker.stxAddress,
    poxAddress,
    extendCount: 1,
    privateKey: poolAdmin.privateKey,
  });
  console.log(result);

  const rewardCycle = poxInfo.reward_cycle_id + 1;
  const signerKey = signer.publicKey;
  const authId = 2;
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
    signerSignature: signerSignature,
    maxAmount,
    authId,
    privateKey: poolAdmin.privateKey,
  });
  console.log(result);
};
commit();
