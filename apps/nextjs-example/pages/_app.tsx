import type { AppProps } from "next/app";
import { AppContext } from "../components/AppContext";
import { DevTWallet } from "@atomrigslab/aptos-wallet-adapter"

new DevTWallet();

// order matters
import "../styles/global.css";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContext>
      <Component {...pageProps} />
    </AppContext>
  );
}

export default MyApp;
