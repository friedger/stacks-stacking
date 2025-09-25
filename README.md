# Stacking on Devnet

1. wait for local devnet to be ready
2. call `npx tsx 1-delegate.ts`
3. call `npx tsx 2-lock-commit-pox-addr-1.ts`
4. wait until next cycle
5. call `npx tsx 3-extend-commit-pox-addr-2.ts`
6. wait until end of next cycle
7. call `curl -L   "http://localhost:3999/extended/v1/burnchain/rewards"   -H 'Accept: application/json' | jq`

See rewards for both pox rewards addressed.

`mg1C76bNTutiCDV3t9nWhZs3Dc8LzUufj8` received rewards in the first stacking cycle.
`mweN5WVqadScHdA81aATSdcVr4B6dNokqx` received them in the second cycle.
