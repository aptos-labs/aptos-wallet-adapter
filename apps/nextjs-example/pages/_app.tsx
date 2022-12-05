import "../styles/global.css";
import type { AppProps } from "next/app";
import {
  PetraWallet,
  MartianWallet,
  RiseWallet,
} from "@aptos-labs/wallet-adapter-plugin/src/wallets";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const wallets = [new PetraWallet(), new MartianWallet(), new RiseWallet()];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <Component {...pageProps} />
    </AptosWalletAdapterProvider>
  );
}

export default MyApp;
