// read file settings/devnet.toml and convert to json

import { getPublicKeyFromPrivate } from "@stacks/encryption";
import { getAddressFromPrivateKey } from "@stacks/transactions";
import { generateWallet } from "@stacks/wallet-sdk";
import { c32ToB58 } from "c32check";
import { readFileSync } from "fs";
import path from "path";
import { parse } from "toml";

const __dirname = path.resolve();

const filePath = path.join(__dirname, "settings", "Devnet.toml");
const fileContent = readFileSync(filePath, "utf-8");
const config = parse(fileContent);

// Helper function to generate account data from mnemonic
async function getAccountFromMnemonic(
  mnemonic: string,
  accountIndex: number = 0
) {
  try {
    // Derive private key from mnemonic
    const wallet = await generateWallet({ secretKey: mnemonic, password: "" });

    const privateKey = wallet.accounts[accountIndex].stxPrivateKey;
    const publicKey = getPublicKeyFromPrivate(privateKey);
    // Derive STX address from private key
    const stxAddress = getAddressFromPrivateKey(privateKey, "testnet");
    const btcAddress = c32ToB58(stxAddress);
    return {
      privateKey,
      stxAddress,
      btcAddress,
      publicKey,
    };
  } catch (error) {
    console.warn(`Failed to generate keys for mnemonic: ${error}`);
    return {
      privateKey: "",
      stxAddress: "",
      btcAddress: "",
      publicKey: "",
    };
  }
}

export const createAccounts = async (): Promise<{
  [key: string]: {
    privateKey: string;
    stxAddress: string;
    btcAddress: string;
    publicKey: string;
  };
}> => {
  const [deployer, signer, wallet_2, wallet_3, poolAdmin, stacker] =
    await Promise.all(
      Object.keys(config.accounts).map(async (k) => {
        const account = await getAccountFromMnemonic(
          config.accounts[k].mnemonic
        );
        return {
          ...config.accounts[k],
          ...account,
        };
      })
    );
  return { deployer, signer, wallet_2, wallet_3, poolAdmin, stacker };
};

export const client = {
  baseUrl: "http://localhost:3999",
};
