"use client";

import {
  Account,
  APTOS_COIN,
  Ed25519PrivateKey,
  generateSigningMessageForTransaction,
  Network,
} from "@aptos-labs/ts-sdk";
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
  AdapterWallet,
} from "@aptos-labs/cross-chain-react";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import USDC from "./icons/USDC";
import { chainToIcon } from "./icons";

import { WalletSelector } from "./components/walletSelector/xchain/WalletSelector";
import { AptosWalletSelector } from "./components/walletSelector/aptos/WalletSelector";

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
  const [showDestinationAddressInput, setShowDestinationAddressInput] =
    useState<boolean>(false);
  const [destinationAddress, setDestinationAddress] = useState<string>("");

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

  const [sourceWallet, setSourceWallet] = useState<AdapterWallet | undefined>(
    undefined
  );

  const [destinationWallet, setDestinationWallet] = useState<
    AdapterWallet | undefined
  >(undefined);

  const chains = Object.values(testnetChains);

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
      if (!destinationWallet) {
        throw new Error("Missing destination wallet");
      }
      if (!sourceWallet) {
        throw new Error("Missing source wallet");
      }
      const { originChainTxnId, destinationChainTxnId } =
        await initiateTransfer({
          sourceChain,
          destinationAddress:
            // this is from the input field
            destinationAddress ??
            // this is from the connected wallet
            (await destinationWallet?.getAccount())?.address?.toString(),
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
              <div
                key={index}
                className="flex flex-col gap-2 items-center w-full"
              >
                <Button
                  className="w-full"
                  onClick={() => setSourceChain(chain.displayName as Chain)}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      src={chainToIcon(chain.displayName as any)}
                      alt={chain.displayName?.toString() ?? ""}
                      height="32px"
                      width="32px"
                    />
                    <p>USDC</p>
                  </div>
                </Button>
                <span>{chain.chainId}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full">
            <p className="text-md font-bold">From</p>
            <WalletSelector
              transactionInProgress={transactionInProgress}
              sourceChain={sourceChain}
              onWalletConnect={(wallet) => setSourceWallet(wallet)}
              wallet={sourceWallet}
            />
          </div>
          <div className="flex flex-col w-full">
            {showDestinationAddressInput ? (
              <>
                <p
                  className="text-sm text-gray-500 text-right cursor-pointer"
                  onClick={() => setShowDestinationAddressInput(false)}
                >
                  Select Aptos Wallet
                </p>
                <Input
                  placeholder="Enter destination address"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="flex flex-row justify-between gap-2">
                  <p className="text-md font-bold">To Aptos</p>
                  <p
                    className="text-sm text-gray-500 cursor-pointer"
                    onClick={() => setShowDestinationAddressInput(true)}
                  >
                    Enter destination address
                  </p>
                </div>
                <AptosWalletSelector
                  transactionInProgress={transactionInProgress}
                  sourceChain={sourceChain}
                  onWalletConnect={(wallet) => setDestinationWallet(wallet)}
                  wallet={destinationWallet}
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p>Amount</p>
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
                Transfer
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
