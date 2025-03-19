"use client";

import { Account, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import { useCallback, useEffect, useState } from "react";
import { Loader2, MoveDown } from "lucide-react";
import {
  Chain,
  UsdcBalance,
  useCrossChainWallet,
  testnetChains,
  mainnetChains,
  QuoteResponse,
  WormholeInitiateTransferResponse,
} from "@aptos-labs/cross-chain-react";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import USDC from "./icons/USDC";
import { chainToIcon } from "./icons";

import { WalletSelector } from "./components/walletSelector/WalletSelector";

const privateKey = new Ed25519PrivateKey(
  process.env.NEXT_PUBLIC_SWAP_CCTP_MAIN_SIGNER_PRIVATE_KEY as string
);
const mainSigner = Account.fromPrivateKey({ privateKey });

const feePayerPrivateKey = new Ed25519PrivateKey(
  process.env.NEXT_PUBLIC_SWAP_CCTP_SPONSOR_ACCOUNT_PRIVATE_KEY as string
);
const sponsorAccount = Account.fromPrivateKey({
  privateKey: feePayerPrivateKey,
});

const dappNetwork: Network.MAINNET | Network.TESTNET = Network.TESTNET;

export default function Swap() {
  const {
    wallet,
    getQuote,
    initiateTransfer,
    sourceChain,
    setSourceChain,
    getChainInfo,
  } = useCrossChainWallet();
  const { toast } = useToast();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [quote, setQuote] = useState<QuoteResponse | undefined>(undefined);

  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const [transactionCompleted, setTransactionCompleted] =
    useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [transferResponse, setTransferResponse] = useState<
    WormholeInitiateTransferResponse | undefined
  >(undefined);
  const [sourceWalletUSDCBalance, setSourceWalletUSDCBalance] = useState<
    UsdcBalance | undefined
  >(undefined);
  const [invalidAmount, setInvalidAmount] = useState<boolean>(false);
  const [quoteIsFetching, setQuoteIsFetching] = useState<boolean>(false);

  const chains =
    dappNetwork === Network.TESTNET ? testnetChains : mainnetChains;

  const onSetAmount = useCallback(
    (amount: string) => {
      if (!sourceChain) return;
      if (!amount) {
        setAmount("");
        setQuote(undefined);
        setInvalidAmount(false);
        return;
      }
      setQuoteIsFetching(true);
      setInvalidAmount(false);
      setAmount(amount);

      if (invalidateAmount(amount)) {
        setInvalidAmount(true);
        setQuoteIsFetching(false);
        return;
      }

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const newTimeout = setTimeout(async () => {
        const quote = await getQuote({ amount, sourceChain });
        setQuote(quote);
        setQuoteIsFetching(false);
      }, 500);

      setDebounceTimeout(newTimeout);
    },
    [sourceChain, debounceTimeout]
  );

  const humanReadableETA = (milliseconds: number): string => {
    if (milliseconds >= 60000) {
      const minutes = Math.floor(milliseconds / 60000);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      const seconds = Math.floor(milliseconds / 1000);
      return `${seconds} second${seconds > 1 ? "s" : ""}`;
    }
  };

  const invalidateAmount = (amount: string) => {
    if (!sourceWalletUSDCBalance || !amount) {
      return;
    }
    return Number(amount) > Number(sourceWalletUSDCBalance.display);
  };

  const onTransferClick = async () => {
    setTransactionInProgress(true);
    const transfer = async () => {
      if (!sourceChain) {
        throw new Error("Missing required parameters");
      }
      const { originChainTxnId, destinationChainTxnId } =
        await initiateTransfer({
          sourceChain,
          // TODO: ideally it is be the DAA address
          destinationAddress:
            "0x38383091fdd9325e0b8ada990c474da8c7f5aa51580b65eb477885b6ce0a36b7",
          mainSigner,
          sponsorAccount,
        });
      return { originChainTxnId, destinationChainTxnId };
    };
    transfer()
      .then((response) => {
        setTransferResponse(response);
        setTransactionInProgress(false);
        setTransactionCompleted(true);
      })
      .catch((error) => {
        console.error("Error transferring", error);
      })
      .finally(() => {
        setTransactionInProgress(false);
      });
  };

  const onSignMessage = async () => {
    if (!wallet) {
      return;
    }

    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: Math.random().toString(16),
    };
    try {
      const signature = await wallet.signMessage(payload);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <Card className="w-96">
        <CardContent className="flex flex-col gap-8 pt-6">
          <div className="flex flex-row gap-2">
            {Object.values(chains).map((chain, index) => (
              <Button
                key={index}
                className="w-full"
                onClick={() => setSourceChain(chain.displayName as Chain)}
              >
                {chain.displayName}
              </Button>
            ))}
            <Button className="w-full" onClick={() => setSourceChain("Aptos")}>
              Aptos
            </Button>
          </div>
          <div className="flex flex-col w-full">
            <WalletSelector
              transactionInProgress={transactionInProgress}
              sourceChain={sourceChain}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p>Sign Message</p>
            <Button disabled={!wallet} onClick={onSignMessage}>
              Sign Message
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <p>CCTP transfer</p>
            <div className="flex flex-row gap-2 items-center">
              <Input
                value={amount}
                onChange={(e) => onSetAmount(e.target.value)}
              />
              <div className="flex flex-col cursor-pointer">
                <span>Max</span>
                <span>
                  {sourceWalletUSDCBalance
                    ? sourceWalletUSDCBalance.display
                    : "0"}
                </span>
              </div>
            </div>
            {quoteIsFetching && (
              <p className="flex flex-col items-center justify-center text-center">
                <Loader2 className="animate-spin" />
              </p>
            )}
            {invalidAmount && (
              <p className="text-red-500">
                Amount is greater than the balance of the source wallet
              </p>
            )}
            {quote && !invalidAmount && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-row items-center">
                    <div className="w-10 h-10">
                      <USDC />
                    </div>
                    <div
                      className="w-4 h-4"
                      style={{
                        position: "relative",
                        bottom: 0,
                        top: 15,
                        right: 14,
                        backgroundColor: "black",
                        padding: 4,
                        borderRadius: 4,
                      }}
                    >
                      <img
                        src={chainToIcon(sourceChain as any)}
                        alt={sourceChain?.toString() ?? ""}
                        height="32px"
                        width="32px"
                      />
                    </div>
                    <div>
                      <p>-{amount} USDC</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <MoveDown />
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="w-10 h-10">
                      <USDC />
                    </div>
                    <div
                      className="w-4 h-4"
                      style={{
                        position: "relative",
                        bottom: 0,
                        top: 15,
                        right: 14,
                        backgroundColor: "black",
                        padding: 4,
                        borderRadius: 4,
                      }}
                    >
                      <img
                        src={chainToIcon("Aptos")}
                        alt="Aptos"
                        height="32px"
                        width="32px"
                      />
                    </div>
                    <div>
                      <p>+{amount} USDC</p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between py-4">
                    <div className="flex flex-col">
                      <p className="text-sm">via Wormhole</p>
                    </div>
                    <p className="text-md">
                      ~{humanReadableETA(quote.eta ?? 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!transactionInProgress && !transactionCompleted && (
              <Button
                onClick={onTransferClick}
                disabled={!amount || !wallet || invalidAmount || !quote}
              >
                Confirm
              </Button>
            )}

            {transactionInProgress && !transactionCompleted && (
              <div className="flex flex-col gap-4">
                <p className="text-lg text-center">Submitting transaction</p>
                <Button disabled>
                  <Loader2 className="animate-spin" />
                </Button>
              </div>
            )}

            {!transactionInProgress && transactionCompleted && (
              <div className="flex flex-col gap-4">
                <Button onClick={() => window.location.reload()}>
                  Start a new Transaction
                </Button>
              </div>
            )}

            {transferResponse && (
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-lg">Transaction submitted</p>
                {transferResponse.originChainTxnId && (
                  <a
                    href={`${getChainInfo(sourceChain!).explorerUrl}/tx/${transferResponse.originChainTxnId}?cluster=${
                      dappNetwork === Network.MAINNET ? "mainnet" : "devnet"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-md underline">
                      View on {getChainInfo(sourceChain!).explorerName}
                    </p>
                  </a>
                )}
                {transferResponse.destinationChainTxnId && (
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${transferResponse.destinationChainTxnId}?network=${
                      dappNetwork === Network.MAINNET ? "mainnet" : "testnet"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-md underline">View on Aptos Explorer</p>
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
