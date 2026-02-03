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
  CrossChainCore,
  EthereumChainIdToMainnetChain,
  EthereumChainIdToTestnetChain,
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

export function CCTPWithdraw({
  wallet,
  originWalletDetails,
  sponsorAccount,
  dappNetwork,
  crossChainCore,
  provider,
}: {
  wallet: AdapterWallet | null;
  originWalletDetails: OriginWalletDetails | undefined;
  sponsorAccount: Account;
  dappNetwork: Network.MAINNET | Network.TESTNET;
  crossChainCore: CrossChainCore;
  provider: any; // We'll type this properly later
}) {
  const { toast } = useToast();
  const { account, network } = useWallet();
  const {
    aptosBalance,
    fetchAptosBalance,
    refetchBalances,
    globalTransactionInProgress,
    setGlobalTransactionInProgress,
  } = useUSDCBalance();

  const [withdrawInProgress, setWithdrawInProgress] = useState(false);

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
    if (!account?.address) return;
    fetchAptosBalance(account.address.toString());
  }, [account?.address, network, fetchAptosBalance]);

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
          type: "withdraw",
        });
        setQuote(quote);
        setQuoteIsFetching(false);
      }, 500);

      setDebounceTimeout(newTimeout);
    },
    [sourceChain, debounceTimeout, aptosBalance],
  );

  const invalidateAmount = (amount: string) => {
    return Number(amount) > Number(aptosBalance ?? "0");
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

  const onWithdrawClick = async () => {
    setGlobalTransactionInProgress(true);
    setWithdrawInProgress(true);
    const transfer = async () => {
      const { originChainTxnId, destinationChainTxnId } =
        await provider.withdraw({
          sourceChain,
          wallet,
          destinationAddress: originWalletDetails?.address.toString(),
          sponsorAccount,
        });
      return { originChainTxnId, destinationChainTxnId };
    };
    transfer()
      .then((response) => {
        console.log("response", response);
        setTransferResponse(response);
        setTransactionCompleted(true);
        // refetch all balances after the process
        refetchBalances();
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
        setWithdrawInProgress(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CCTP withdraw</CardTitle>
        <CardDescription>
          Withdraw USDC from your derived Aptos account to your original{" "}
          {sourceChain?.toString()} account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
          <Input value={amount} onChange={(e) => onSetAmount(e.target.value)} />
          <div className="flex flex-col cursor-pointer">
            <span>Max</span>
            <span onClick={() => onSetAmount(aptosBalance ?? "0")}>
              {aptosBalance ?? "0"}
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
                    src={chainToIcon("Aptos")}
                    alt="Aptos"
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
                    src={chainToIcon(sourceChain as any)}
                    alt={sourceChain?.toString() ?? ""}
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

        {!withdrawInProgress && !transactionCompleted && (
          <Button
            onClick={onWithdrawClick}
            disabled={
              !amount || !wallet || !quote || globalTransactionInProgress
            }
          >
            Withdraw
          </Button>
        )}

        {withdrawInProgress && !transactionCompleted && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Withdraw
          </Button>
        )}

        {withdrawInProgress && transactionCompleted && (
          <div className="flex flex-col gap-4">
            <p className="text-lg text-center">Submitting transaction</p>
            <Button disabled>
              <Loader2 className="animate-spin" />
            </Button>
          </div>
        )}

        {!withdrawInProgress && transactionCompleted && (
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
                href={`https://explorer.aptoslabs.com/txn/${transferResponse.originChainTxnId}?network=${
                  dappNetwork === Network.MAINNET ? "mainnet" : "testnet"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-md underline">View on Aptos Explorer</p>
              </a>
            )}
            {transferResponse.destinationChainTxnId && (
              <a
                href={`${getChainInfo(sourceChain!).explorerUrl}/tx/${transferResponse.destinationChainTxnId}?cluster=${
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
