import "../styles/global.css";
import type { AppProps } from "next/app";

import { AppContext } from "../components/AppContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContext>
      <Component {...pageProps} />
    </AppContext>
  );
}

export default MyApp;
