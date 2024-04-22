import type { AppProps } from "next/app";
import { AppContext } from "../components/AppContext";

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
