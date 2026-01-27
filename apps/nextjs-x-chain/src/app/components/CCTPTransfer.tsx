import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChainConfig,
  EthereumChainIdToTestnetChain,
  CrossChainCore,
  EthereumChainIdToMainnetChain,
} from "@aptos-labs/cross-chain-core";
import {
  Account,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import {
  Chain,
  WormholeTransferResponse,
  WormholeQuoteResponse,
} from "@aptos-labs/cross-chain-core";
import { Loader2, MoveDown } from "lucide-react";
import USDC from "@/app/icons/USDC";
import { chainToIcon } from "@/app/icons";
import { AdapterWallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  isEIP1193DerivedWallet,
  isSuiDerivedWallet,
  OriginWalletDetails,
} from "@/utils/derivedWallet";
import { isSolanaDerivedWallet } from "@/utils/derivedWallet";
import { useUSDCBalance } from "@/contexts/USDCBalanceContext";
import { useToast } from "@/components/ui/use-toast";

export function CCTPTransfer({
  wallet,
  originWalletDetails,
  mainSigner,
  sponsorAccount,
  dappNetwork,
  crossChainCore,
  provider,
}: {
  wallet: AdapterWallet | null;
  originWalletDetails: OriginWalletDetails | undefined;
  mainSigner: Account;
  sponsorAccount: Account;
  dappNetwork: Network.MAINNET | Network.TESTNET;
  crossChainCore: CrossChainCore;
  provider: any; // We'll type this properly later
}) {
  const { toast } = useToast();
  const { account, network } = useWallet();
  const {
    originBalance,
    fetchOriginBalance,
    refetchBalancesWithDelay,
    globalTransactionInProgress,
    setGlobalTransactionInProgress,
  } = useUSDCBalance();

  const [transferInProgress, setTransferInProgress] = useState(false);

  const [amount, setAmount] = useState<string>("");

  const [quote, setQuote] = useState<WormholeQuoteResponse | undefined>(
    undefined,
  );
  const [invalidAmount, setInvalidAmount] = useState<boolean>(false);
  const [quoteIsFetching, setQuoteIsFetching] = useState<boolean>(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const [transactionCompleted, setTransactionCompleted] =
    useState<boolean>(false);
  const [transferResponse, setTransferResponse] = useState<
    WormholeTransferResponse | undefined
  >(undefined);
  const [balanceUpdatePending, setBalanceUpdatePending] =
    useState<boolean>(false);

  const [sourceChain, setSourceChain] = useState<Chain | null>(null);

  useEffect(() => {
    if (!wallet) return;
    if (isSolanaDerivedWallet(wallet)) {
      setSourceChain("Solana");
    } else if (isEIP1193DerivedWallet(wallet)) {
      const fetchWalletChainId = async () => {
        const chainId = await wallet.eip1193Provider.request({
          method: "eth_chainId",
        });
        return chainId;
      };
      fetchWalletChainId().then((chainId: string) => {
        const actualChainId = parseInt(chainId, 16);
        const chain =
          network?.name === Network.MAINNET
            ? EthereumChainIdToMainnetChain[actualChainId]
            : EthereumChainIdToTestnetChain[actualChainId];
        setSourceChain(chain.key);
      });
    } else if (isSuiDerivedWallet(wallet)) {
      setSourceChain("Sui");
    } else {
      setSourceChain("Aptos");
    }
  }, [wallet]);

  useEffect(() => {
    if (!sourceChain || !originWalletDetails) return;
    fetchOriginBalance(originWalletDetails.address.toString(), sourceChain);
  }, [originWalletDetails, network, sourceChain, fetchOriginBalance]);

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
          originChain: sourceChain,
          type: "transfer",
        });
        setQuote(quote);
        setQuoteIsFetching(false);
      }, 500);

      setDebounceTimeout(newTimeout);
    },
    [sourceChain, debounceTimeout, originBalance],
  );

  const invalidateAmount = (amount: string) => {
    return Number(amount) > Number(originBalance ?? "0");
  };

  const onTransferClick = async () => {
    setGlobalTransactionInProgress(true);
    setTransferInProgress(true);
    const transfer = async () => {
      if (!sourceChain) {
        throw new Error("Missing required parameters sourceChain");
      }
      const { originChainTxnId, destinationChainTxnId } =
        await provider.transfer({
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
        setTransactionCompleted(true);
        setBalanceUpdatePending(true);
        // Use delayed refetch for cross-chain transfers - origin updates immediately, Aptos balance updates after delay
        refetchBalancesWithDelay(8000); // 8 second delay for cross-chain processing

        // Clear the pending state after the delay
        setTimeout(() => {
          setBalanceUpdatePending(false);
        }, 8500);
      })
      .catch((error) => {
        console.error("Error transferring", error);
        toast({
          title: "Error transferring",
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setGlobalTransactionInProgress(false);
        setTransferInProgress(false);
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
          Transfer USDC from your original {sourceChain?.toString()} account to
          your derived Aptos account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
          <Input value={amount} onChange={(e) => onSetAmount(e.target.value)} />
          <div className="flex flex-col cursor-pointer">
            <span>Max</span>
            <span onClick={() => onSetAmount(originBalance ?? "0")}>
              {originBalance ?? "0"}
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

        {balanceUpdatePending && (
          <p className="text-blue-500 text-sm">
            ⏳ Aptos balance will update shortly after cross-chain transaction
            completes...
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

        {!transferInProgress && !transactionCompleted && (
          <Button
            onClick={onTransferClick}
            disabled={
              !amount || !wallet || !quote || globalTransactionInProgress
            }
          >
            Transfer
          </Button>
        )}

        {transferInProgress && !transactionCompleted && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Transfer
          </Button>
        )}

        {transferInProgress && transactionCompleted && (
          <div className="flex flex-col gap-4">
            <p className="text-lg text-center">Submitting transaction</p>
            <Button disabled>
              <Loader2 className="animate-spin" />
            </Button>
          </div>
        )}

        {!transferInProgress && transactionCompleted && (
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
