import {
  PetraWallet,
  MartianWallet,
  RiseWallet,
} from "@aptos/wallet-adapter-plugin/src/wallets";
import { AptosWalletAdapterProvider } from "@aptos/wallet-adapter-react/src";

import App from "./App";

export default function Web() {
  const wallets = [new PetraWallet(), new MartianWallet(), new RiseWallet()];

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <div className="container mx-auto">
        <h1 className="text-center text-3xl font-bold space-y-4">
          Aptos Wallet Adapter Demo
        </h1>
        <App wallets={wallets} />
      </div>
    </AptosWalletAdapterProvider>
  );
}
