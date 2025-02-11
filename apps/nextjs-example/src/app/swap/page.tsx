"use client";

import { MultiChain } from "@aptos-labs/wallet-adapter-swap";
import "@aptos-labs/wallet-adapter-swap/dist/index.css";
import { Ed25519PrivateKey, Account } from "@aptos-labs/ts-sdk";

// const privateKey = new Ed25519PrivateKey("<account-private-key>");
// const sponsorAccount = Account.fromPrivateKey({ privateKey });

export default function Swap() {
  return <MultiChain />;
}
