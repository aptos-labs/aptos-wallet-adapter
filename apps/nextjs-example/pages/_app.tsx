import "../styles/global.css";
import type { AppProps } from "next/app";
import {
  PetraWallet,
  MartianWallet,
  RiseWallet,
} from "@aptos/wallet-adapter-plugin/src/wallets";
import { AptosWalletAdapterProvider } from "@aptos/wallet-adapter-react/src";

function MyApp({ Component, pageProps }: AppProps) {
  const wallets = [new PetraWallet(), new MartianWallet(), new RiseWallet()];
  return (
    <AptosWalletAdapterProvider plugins={wallets}>
      <Component {...pageProps} />
    </AptosWalletAdapterProvider>
  );
}

export default MyApp;
