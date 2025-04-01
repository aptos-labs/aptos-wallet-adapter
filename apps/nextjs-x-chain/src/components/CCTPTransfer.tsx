import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { ChainConfig, CrossChainCore } from "@aptos-labs/cross-chain-core";
import {
  Account,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import {
  Chain,
  WormholeInitiateTransferResponse,
  WormholeQuoteResponse,
} from "@aptos-labs/cross-chain-core";
import { SolanaDerivedWallet } from "@aptos-labs/derived-wallet-solana";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { Loader2, MoveDown } from "lucide-react";
import USDC from "@/app/icons/USDC";
import { chainToIcon } from "@/app/icons";
import { EIP1193DerivedWallet } from "@aptos-labs/derived-wallet-ethereum";
import {
  OriginWalletDetails,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

const dappNetwork: Network.MAINNET | Network.TESTNET = Network.TESTNET;

const crossChainCore = new CrossChainCore({
  dappConfig: { aptosNetwork: dappNetwork },
});
const provider = crossChainCore.getProvider("Wormhole");

let mainSigner: Account;
let sponsorAccount: Account;

const privateKey = new Ed25519PrivateKey(
  PrivateKey.formatPrivateKey(
    (process.env.NEXT_PUBLIC_SWAP_CCTP_MAIN_SIGNER_PRIVATE_KEY as string) ??
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    PrivateKeyVariants.Ed25519
  )
);
mainSigner = Account.fromPrivateKey({ privateKey });

const feePayerPrivateKey = new Ed25519PrivateKey(
  PrivateKey.formatPrivateKey(
    (process.env.NEXT_PUBLIC_SWAP_CCTP_SPONSOR_ACCOUNT_PRIVATE_KEY as string) ??
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    PrivateKeyVariants.Ed25519
  )
);
sponsorAccount = Account.fromPrivateKey({
  privateKey: feePayerPrivateKey,
});

export function CCTPTransfer({
  wallet,
  originWalletDetails,
}: {
  wallet: AdapterWallet | null;
  originWalletDetails: OriginWalletDetails | undefined;
}) {
  const { account } = useWallet();

  const [amount, setAmount] = useState<string>("");

  const [quote, setQuote] = useState<WormholeQuoteResponse | undefined>(
    undefined
  );
  const [invalidAmount, setInvalidAmount] = useState<boolean>(false);
  const [quoteIsFetching, setQuoteIsFetching] = useState<boolean>(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [walletUSDCBalance, setWalletUSDCBalance] = useState<
    string | undefined
  >(undefined);

  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const [transactionCompleted, setTransactionCompleted] =
    useState<boolean>(false);
  const [transferResponse, setTransferResponse] = useState<
    WormholeInitiateTransferResponse | undefined
  >(undefined);

  const [sourceChain, setSourceChain] = useState<Chain | null>(null);

  useEffect(() => {
    if (wallet instanceof SolanaDerivedWallet) {
      setSourceChain("Solana");
    } else if (wallet instanceof EIP1193DerivedWallet) {
      setSourceChain("Sepolia");
    } else {
      setSourceChain("Aptos");
    }
  }, [wallet]);

  useEffect(() => {
    if (!sourceChain) return;
    if (!originWalletDetails) return;
    const fetchWalletUsdcBalance = async () => {
      const balance = await crossChainCore.getWalletUSDCBalance(
        originWalletDetails.address.toString(),
        sourceChain
      );
      setWalletUSDCBalance(balance);
    };
    fetchWalletUsdcBalance();
  }, [originWalletDetails]);

  const humanReadableETA = (milliseconds: number): string => {
    if (milliseconds >= 60000) {
      const minutes = Math.floor(milliseconds / 60000);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      const seconds = Math.floor(milliseconds / 1000);
      return `${seconds} second${seconds > 1 ? "s" : ""}`;
    }
  };

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
        const quote = await provider?.getQuote({
          amount,
          sourceChain,
        });
        setQuote(quote);
        setQuoteIsFetching(false);
      }, 500);

      setDebounceTimeout(newTimeout);
    },
    [sourceChain, debounceTimeout]
  );

  const invalidateAmount = (amount: string) => {
    return Number(amount) > Number(walletUSDCBalance ?? "0");
  };

  const onTransferClick = async () => {
    setTransactionInProgress(true);
    const transfer = async () => {
      if (!sourceChain) {
        throw new Error("Missing required parameters sourceChain");
      }
      const { originChainTxnId, destinationChainTxnId } =
        await provider.initiateCCTPTransfer({
          sourceChain,
          wallet,
          destinationAddress: account?.address?.toString() ?? "",
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

  const getChainInfo = (chain: Chain): ChainConfig => {
    if (!crossChainCore) {
      throw new Error("CrossChainCore is not set");
    }
    const chainConfig = crossChainCore.CHAINS[chain];
    if (!chainConfig) {
      throw new Error(`Chain config not found for chain: ${chain}`);
    }
    return chainConfig;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CCTP transfer</CardTitle>
        <CardDescription>
          Transfer USDC to your derived Aptos account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
          <Input value={amount} onChange={(e) => onSetAmount(e.target.value)} />
          <div className="flex flex-col cursor-pointer">
            <span>Max</span>
            <span onClick={() => onSetAmount(walletUSDCBalance ?? "0")}>
              {walletUSDCBalance ?? "0"}
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
                <p className="text-md">~{humanReadableETA(quote.eta ?? 0)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!transactionInProgress && !transactionCompleted && (
          <Button
            onClick={onTransferClick}
            disabled={!amount || !wallet || !quote}
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
      </CardContent>
    </Card>
  );
}
