import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { PropsWithChildren } from "react";
import { AutoConnectProvider } from "@/components/AutoConnectProvider";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { USDCBalanceProvider } from "@/contexts/USDCBalanceContext";
import { Network } from "@aptos-labs/ts-sdk";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Constant network configuration
const dappNetwork: Network.MAINNET | Network.TESTNET = Network.TESTNET;

export const metadata: Metadata = {
  title: "Aptos Cross Chain Wallet Adapter Example",
  description:
    "An example of how to use Aptos Cross Chain Wallet Adapter with React and Next.js.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex justify-center min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AutoConnectProvider>
            <ReactQueryClientProvider>
              <WalletProvider>
                <USDCBalanceProvider dappNetwork={dappNetwork}>
                  {children}
                  <Toaster />
                </USDCBalanceProvider>
              </WalletProvider>
            </ReactQueryClientProvider>
          </AutoConnectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
