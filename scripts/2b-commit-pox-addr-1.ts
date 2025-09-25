import { StackingClient } from "@stacks/stacking";
import { createAccounts, client } from "./config";

const commit = async () => {
  const { signer, poolAdmin } = await createAccounts();

  const c = new StackingClient({
    address: poolAdmin.stxAddress,
    client: client,
    network: "devnet",
  });
  const poxInfo = await c.getPoxInfo();

  const poxAddress = poolAdmin.btcAddress;

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

  let result = await c.stackAggregationCommitIndexed({
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
