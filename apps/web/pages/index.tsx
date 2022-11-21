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
      <div>
        <h1>Web</h1>
      </div>
      <App wallets={wallets} />
    </AptosWalletAdapterProvider>
  );
}
