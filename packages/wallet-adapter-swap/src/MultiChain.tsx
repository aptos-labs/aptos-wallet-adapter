import "./global.css";
import { FC, useEffect, useState } from "react";
import { Loader2, MoveDown } from "lucide-react";
import {
  Ed25519Account,
  Network as AptosNetwork,
  Ed25519PrivateKey,
  Account,
} from "@aptos-labs/ts-sdk";
import {
  chainToPlatform,
  routes,
  TokenId,
  Wormhole,
  wormhole,
  Chain,
  Platform,
  Network,
  TransferState,
  PlatformContext,
  amount as amountUtils,
} from "@wormhole-foundation/sdk";
import { chainToIcon } from "@wormhole-foundation/sdk-icons";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { SolanaWalletSelector } from "./components/walletSelector/solana/SolanaWalletSelector";
import {
  AptosMainnetUSDCToken,
  AptosTestnetUSDCToken,
  mainnetChainTokens,
  testnetChainTokens,
} from "./utils/index";
import { ChainSelect } from "./components/ChainSelect";
import { Input } from "./ui/input";
import { Signer } from "./signer/Signer";
import { sleep } from "./signer/SolanaSigner";
import { Progress } from "./ui/progress";
import { EthereumWalletSelector } from "./components/walletSelector/ethereum/EthereumWalletSelector";
import USDC from "./icons/USDC";
import { logger } from "./utils/logger";
import { AptosLocalSigner } from "./signer/AptosLocalSigner";

// should come from transaction stream worker
const claimSignerPrivateKey = new Ed25519PrivateKey(
  "0xddc1abd2ebb35b6ffa7c328f1b1d672e48073adb32cd3c95a911d6df2e205920"
);
const claimSignerAccount = Account.fromPrivateKey({
  privateKey: claimSignerPrivateKey,
});

// should come from gas station
const feePayerPrivateKey = new Ed25519PrivateKey(
  "0xedae3fa4f04fdee1e3458b9e38d006ebca0101bd9d8a124db9dd9e8dc3707b45"
);
const feePayerStaticAccount = Account.fromPrivateKey({
  privateKey: feePayerPrivateKey,
});

// should be derived from hash(domain_name + source_chain_address + domain_separator)
const destinationAccountAddress =
  "0x38383091fdd9325e0b8ada990c474da8c7f5aa51580b65eb477885b6ce0a36b7";

export interface MultiChainProps {
  feePayerAccount?: Ed25519Account;
  dappConfig?: { network: AptosNetwork.MAINNET | AptosNetwork.TESTNET };
}

export const MultiChain: FC<MultiChainProps> = ({
  feePayerAccount = undefined,
  dappConfig,
}) => {
  const isMainnet = dappConfig?.network === AptosNetwork.MAINNET;
  const chainToken = isMainnet ? mainnetChainTokens : testnetChainTokens;

  const [sourceWallet, setSourceWallet] = useState<Wallet | null>(null);

  const [selectedSourceChain, setSelectedSourceChain] =
    useState<Chain>("Solana");
  const [amount, setAmount] = useState<string>("0");

  const [platform, setPlatform] = useState<
    PlatformContext<Network, Platform> | undefined
  >(undefined);

  const [cctpRequest, setCctpRequest] = useState<
    routes.RouteTransferRequest<Network> | undefined
  >(undefined);

  const [cctpRoute, setCctpRoute] = useState<
    | routes.Route<
        Network,
        routes.Options,
        routes.ValidatedTransferParams<routes.Options>,
        routes.Receipt
      >
    | undefined
  >(undefined);

  const [quote, setQuote] = useState<routes.Quote<
    routes.Options,
    routes.ValidatedTransferParams<routes.Options>,
    any
  > | null>(null);

  const [showQuote, setShowQuote] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState<string | null>(null);

  const [wormholeContext, setWormholeContext] = useState<
    Wormhole<Network> | undefined
  >(undefined);

  const [sourceWalletUSDCBalance, setSourceWalletUSDCBalance] =
    useState<amountUtils.Amount | null>(null);

  const [progress, setProgress] = useState(0);
  const [transactionETA, setTransactionETA] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [aptosTransactionId, setAptosTransactionId] = useState<
    string | undefined
  >(undefined);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [countdown, setCountdown] = useState({ minutes: 0, seconds: 0 });

  const [invalidAmount, setInvalidAmount] = useState(false);

  const [wormholeTransactionId, setWormholeTransactionId] = useState<
    string | undefined
  >(undefined);

  const [isCountdownComplete, setIsCountdownComplete] = useState(false);

  const onSetAmount = (amount: string) => {
    if (!cctpRoute) {
      throw new Error("Route is not initialized");
    }
    if (!cctpRequest) {
      throw new Error("Request is not initialized");
    }
    setAmount(amount);
    setQuoteAmount(null);
    setTimeout(async () => {
      setQuoteAmount(amount);
      // TODO what is nativeGas for?
      const transferParams = { amount, options: { nativeGas: 0 } };

      const validated = await cctpRoute.validate(cctpRequest, transferParams);
      if (!validated.valid) {
        logger.log("invalid", validated.valid);
        throw validated.error;
      }
      const quote = await cctpRoute.quote(cctpRequest, validated.params);
      if (!quote.success) {
        logger.log("quote failed", quote.success);
        throw quote.error;
      }

      logger.log("quote", quote);
      setQuote(quote);
      setTransactionETA(Math.ceil((quote.eta ?? 0) / 1000) * 1000);
      setShowQuote(true);
    }, 800);
  };

  const humanReadableETA = (milliseconds: number): string => {
    if (milliseconds >= 60000) {
      const minutes = Math.floor(milliseconds / 60000);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      const seconds = Math.floor(milliseconds / 1000);
      return `${seconds} second${seconds > 1 ? "s" : ""}`;
    }
  };

  useEffect(() => {
    if (!startTime || !transactionETA) return;

    const updateCountdown = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(transactionETA - elapsed, 0); // Ensure non-negative
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);

      setCountdown({ minutes, seconds });

      const progressPercent = Math.min((elapsed / transactionETA) * 100, 100);
      setProgress(progressPercent);

      if (remainingTime === 0) {
        setIsCountdownComplete(true);
        clearInterval(interval);
      }

      if (progressPercent >= 100) {
        clearInterval(interval);
      }
    };

    updateCountdown(); // Initialize immediately
    const interval = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(interval);
  }, [startTime, transactionETA]);

  useEffect(() => {
    if (!sourceWalletUSDCBalance || !amount) {
      return;
    }

    const parsedAmount = amountUtils.parse(
      amount,
      chainToken[selectedSourceChain].decimals
    );

    if (
      amountUtils.units(parsedAmount) >
      amountUtils.units(sourceWalletUSDCBalance)
    ) {
      setInvalidAmount(true);
    } else {
      setInvalidAmount(false);
    }
  }, [sourceWalletUSDCBalance, amount]);

  useEffect(() => {
    const initializeRoute = async () => {
      const wh = await wormhole(isMainnet ? "Mainnet" : "Testnet", [
        solana,
        aptos,
        evm,
      ]);
      setWormholeContext(wh);
      const platform = wh.getPlatform(chainToPlatform(selectedSourceChain));
      setPlatform(platform);

      const sourceToken: TokenId = Wormhole.tokenId(
        chainToken[selectedSourceChain].tokenId.chain as Chain,
        chainToken[selectedSourceChain].tokenId.address
      );
      const aptosChainToken = isMainnet
        ? AptosMainnetUSDCToken
        : AptosTestnetUSDCToken;
      const destToken: TokenId = Wormhole.tokenId(
        aptosChainToken.tokenId.chain as Chain,
        aptosChainToken.tokenId.address
      );

      const sourceContext = wh
        .getPlatform(chainToPlatform(selectedSourceChain))
        .getChain(selectedSourceChain);
      logger.log("sourceContext", sourceContext);
      const destContext = wh
        .getPlatform(chainToPlatform("Aptos"))
        .getChain("Aptos");
      logger.log("destContext", destContext);

      const req = await routes.RouteTransferRequest.create(
        wh,
        {
          source: sourceToken,
          destination: destToken,
        },
        sourceContext,
        destContext
      );

      setCctpRequest(req);

      const resolver = wh.resolver([
        routes.CCTPRoute, // manual CCTP
      ]);

      const route = await resolver.findRoutes(req);
      const cctpRoute = route[0];
      logger.log("cctpRoute", cctpRoute);
      setCctpRoute(cctpRoute);
    };

    initializeRoute();
  }, [selectedSourceChain]);

  useEffect(() => {
    const getBalances = async () => {
      if (!wormholeContext) {
        return;
      }
      if (!sourceWallet) {
        return;
      }

      try {
        const platform = wormholeContext.getPlatform(
          chainToPlatform(selectedSourceChain)
        );
        const rpc = platform.getRpc(selectedSourceChain);

        const result = await platform
          .utils()
          .getBalances(selectedSourceChain, rpc, sourceWallet?.getAddress()!, [
            chainToken[selectedSourceChain].tokenId.address,
          ]);

        const currentAmount =
          result[chainToken[selectedSourceChain].tokenId.address];

        const usdcBalance = amountUtils.fromBaseUnits(
          currentAmount ?? BigInt(0),
          chainToken[selectedSourceChain].decimals
        );

        return usdcBalance;
      } catch (e) {
        console.error("Failed to get token balances", e);
      }
    };

    getBalances().then((usdcBalance) => {
      if (usdcBalance) {
        setSourceWalletUSDCBalance(usdcBalance);
      }
    });
  }, [sourceWallet, platform]);

  const onSetMaxAmount = () => {
    if (!sourceWalletUSDCBalance) {
      return;
    }
    setAmount(
      amountUtils.display(amountUtils.truncate(sourceWalletUSDCBalance, 6))
    );
  };

  const onSwapClick = async () => {
    if (!sourceWallet) {
      return;
    }
    if (!sourceWallet.getAddress()) {
      throw new Error("Source wallet address is undefined");
    }

    if (!cctpRoute) {
      throw new Error("Route is not initialized");
    }

    if (!cctpRequest) {
      throw new Error("Request is not initialized");
    }

    if (!quote) {
      throw new Error("Quote is not initialized");
    }

    const signer = new Signer(
      selectedSourceChain,
      sourceWallet.getAddress()!,
      {},
      sourceWallet
    );

    // initiate transfer
    setTransactionInProgress(true);
    let receipt = await cctpRoute.initiate(
      cctpRequest,
      signer,
      quote,
      Wormhole.chainAddress("Aptos", destinationAccountAddress)
    );
    logger.log("Initiated transfer with receipt: ", receipt);

    setStartTime(Date.now()); // Start the timer

    // The txn hash that shows up on solana and wormhole explorer
    const txId =
      "originTxs" in receipt
        ? receipt.originTxs[receipt.originTxs.length - 1].txid
        : undefined;
    setWormholeTransactionId(txId);
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // Initial delay of 1 second

    while (retries < maxRetries) {
      try {
        for await (receipt of cctpRoute.track(receipt, 120 * 1000)) {
          if (receipt.state >= TransferState.SourceInitiated) {
            logger.log("Receipt is on track ", receipt);

            try {
              const signer = new AptosLocalSigner(
                "Aptos",
                {},
                claimSignerAccount, // the account that signs the "claim" transaction
                feePayerStaticAccount // the fee payer account, should use gas station
              );

              if (routes.isManual(cctpRoute)) {
                const circleAttestationReceipt = await cctpRoute.complete(
                  signer,
                  receipt
                );
                logger.log("Claim receipt: ", circleAttestationReceipt);
                signer.claimedTransactionHashes().forEach((txHash) => {
                  console.log("Claimed transaction hash: ", txHash);
                  setAptosTransactionId(txHash);
                });
                setTransactionInProgress(false);
                setTransactionCompleted(true);
              } else {
                // Should be unreachable
                return undefined;
              }
            } catch (e) {
              console.error("Failed to claim", e);
            }
            return;
          }
        }
      } catch (e) {
        console.error(
          `Error tracking transfer (attempt ${retries + 1} / ${maxRetries}):`,
          e
        );
        // Error: Circle chain id not found for Testnet Ethereum
        const delay = baseDelay * Math.pow(2, retries); // Exponential backoff
        await sleep(delay);
        retries++;
      }
    }
  };

  // const onClaimClick = async () => {
  //   // if (!wallet) {
  //   //   throw new Error("Wallet is not initialized");
  //   // }

  //   if (!cctpRoute) {
  //     throw new Error("Route is not initialized");
  //   }

  //   if (!transactionReceipt) {
  //     throw new Error("Transaction receipt is not initialized");
  //   }

  //   const privateKey = new Ed25519PrivateKey(
  //     "0x085ccf3442892541412303189c2f84adc80287290219a55568361805ac9dc397"
  //   );
  //   const signerAccount = Account.fromPrivateKey({ privateKey });

  //   try {
  //     const signer = new AptosLocalSigner(
  //       "Aptos",
  //       {},
  //       signerAccount,
  //       feePayerAccount
  //     );

  //     if (routes.isManual(cctpRoute)) {
  //       const receipt = await cctpRoute.complete(signer, transactionReceipt);
  //       logger.log("Claim receipt: ", receipt);
  //       setTransactionClaimed(true);
  //     } else {
  //       // Should be unreachable
  //       return undefined;
  //     }
  //   } catch (e) {
  //     console.error("Failed to claim", e);
  //   }
  // };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <Card className="w-96">
        <CardContent className="flex flex-col gap-8 pt-6">
          {/*From*/}
          <ChainSelect
            setSelectedSourceChain={setSelectedSourceChain}
            selectedSourceChain={selectedSourceChain}
            isMainnet={isMainnet}
          />
          <div className="flex flex-col w-full">
            {selectedSourceChain === "Solana" ? (
              <SolanaWalletSelector
                setSourceWallet={setSourceWallet}
                transactionInProgress={transactionInProgress}
              />
            ) : (
              <EthereumWalletSelector
                setSourceWallet={setSourceWallet}
                transactionInProgress={transactionInProgress}
              />
            )}
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Input
              value={amount}
              onChange={(e) => onSetAmount(e.target.value)}
            />
            <div
              className="flex flex-col cursor-pointer"
              onClick={onSetMaxAmount}
            >
              <span>Max</span>
              <span>
                {sourceWalletUSDCBalance
                  ? amountUtils.display(
                      amountUtils.truncate(sourceWalletUSDCBalance, 6)
                    )
                  : "0"}
              </span>
            </div>
          </div>
          {invalidAmount && (
            <p className="text-red-500">
              Amount is greater than the balance of the source wallet
            </p>
          )}
          {showQuote && quoteAmount && !invalidAmount && (
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
                      src={chainToIcon(selectedSourceChain as any)}
                      alt={selectedSourceChain}
                      height="32px"
                      width="32px"
                    />
                  </div>
                  <div>
                    <p>-{quoteAmount} USDC</p>
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
                    <p>+{quoteAmount} USDC</p>
                  </div>
                </div>
                <div className="flex flex-row justify-between py-4">
                  <div className="flex flex-col">
                    <p className="text-sm">via Wormhole</p>
                  </div>
                  <p className="text-md">~{humanReadableETA(transactionETA)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!transactionInProgress && !transactionCompleted && (
            <Button
              onClick={onSwapClick}
              disabled={
                !amount ||
                !sourceWallet ||
                !quoteAmount ||
                !quote ||
                invalidAmount
              }
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
              <Button>Start a new Transaction</Button>
            </div>
          )}

          {/* {transactionInProgress && !isCountdownComplete && (
            <>
              <p className="test-xl">ETA: {humanReadableETA(transactionETA)}</p>
              <p className="text-3xl font-bold">
                {countdown.minutes}:{countdown.seconds}
              </p>
              <Progress value={progress} />
            </>
          )} */}

          {transactionCompleted && (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-lg">Transaction submitted</p>
              {wormholeTransactionId && (
                <a
                  href={`https://explorer.solana.com/tx/${wormholeTransactionId}?cluster=${
                    isMainnet ? "mainnet" : "devnet"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-md underline">View on Solana Explorer</p>
                </a>
              )}
              {aptosTransactionId && (
                <a
                  href={`https://explorer.aptoslabs.com/txn/${aptosTransactionId}?network=${
                    isMainnet ? "mainnet" : "testnet"
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
    </div>
  );
};
