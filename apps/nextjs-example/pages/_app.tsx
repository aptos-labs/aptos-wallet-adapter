import type { AppProps } from "next/app";

import { AppContext } from "../components/AppContext";

require("@aptos-labs/wallet-adapter-ant-design/dist/index.css");
require("../styles/global.css");

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContext>
      <Component {...pageProps} />
    </AppContext>
  );
}

export default MyApp;
