import "./global.css";
import { Card, CardContent } from "./ui/card";
import { WalletSelector } from "./WalletSelector";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  chainToPlatform,
  routes,
  TokenId,
  Wormhole,
  wormhole,
  Chain,
  Platform,
  Network,
  AttestationReceipt,
  TransferState,
  PlatformContext,
  amount as amountUtils,
} from "@wormhole-foundation/sdk";
import { chainToIcon } from "@wormhole-foundation/sdk-icons";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";

import { SolanaWalletSelector } from "./SolanaWalletSelector";
import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import {
  AptosMainnetUSDCToken,
  AptosTestnetUSDCToken,
  mainnetChainTokens,
  testnetChainTokens,
} from "./utils";
import { ChainSelect } from "./ChainSelect";
import { Input } from "./ui/input";
import { Signer } from "./Signer";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosSigner } from "./AptosSigner";
import { sleep } from "./SolanaSigner";
import { Progress } from "./ui/progress";
import { EthereumWalletSelector } from "./EthereumWalletSelector";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";

export const MultiChain = () => {
  const [sourceWalletAddress, setSourceWalletAddress] = useState<string | null>(
    null
  );
  const [sourceWallet, setSourceWallet] = useState<Wallet | null>(null);
  const [selectedSourceChain, setSelectedSourceChain] =
    useState<Chain>("Solana");
  const [amount, setAmount] = useState<string>("0");

  const [transactionReceipt, setTransactionReceipt] =
    useState<routes.Receipt<AttestationReceipt> | null>(null);

  const [destinationWallet, setDestinationWallet] =
    useState<AptosWallet | null>(null);

  const aptosWalletContext = useWallet();
  const { wallet, account, connected } = aptosWalletContext;

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

  const [platform, setPlatform] = useState<
    PlatformContext<Network, Platform> | undefined
  >(undefined);

  const [wormholeContext, setWormholeContext] = useState<
    Wormhole<Network> | undefined
  >(undefined);

  const [sourceWalletUSDCBalance, setSourceWalletUSDCBalance] =
    useState<amountUtils.Amount | null>(null);

  const [progress, setProgress] = useState(0);
  const [transactionETA, setTransactionETA] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [transactionInitiated, setTransactionInitiated] = useState(false);

  useEffect(() => {
    if (!startTime || !transactionETA) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / transactionETA) * 100, 100);
      setProgress(progressPercent);

      if (progressPercent >= 100) {
        clearInterval(interval);
      }
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [startTime, transactionETA]);

  useEffect(() => {
    const initializeRoute = async () => {
      const wh = await wormhole("Testnet", [solana, aptos, evm]);
      setWormholeContext(wh);
      const platform = wh.getPlatform(chainToPlatform(selectedSourceChain));
      setPlatform(platform);

      console.log("selectedSourceChain", selectedSourceChain);
      const sourceToken: TokenId = Wormhole.tokenId(
        testnetChainTokens[selectedSourceChain].tokenId.chain as Chain,
        testnetChainTokens[selectedSourceChain].tokenId.address
      );
      const destToken: TokenId = Wormhole.tokenId(
        AptosTestnetUSDCToken.USDCapt.tokenId.chain as Chain,
        AptosTestnetUSDCToken.USDCapt.tokenId.address
      );

      const sourceContext = wh
        .getPlatform(chainToPlatform(selectedSourceChain))
        .getChain(selectedSourceChain);
      console.log("sourceContext", sourceContext);
      const destContext = wh
        .getPlatform(chainToPlatform("Aptos"))
        .getChain("Aptos");

      // create request
      const req = await routes.RouteTransferRequest.create(
        wh,
        {
          source: sourceToken,
          destination: destToken,
        },
        sourceContext,
        destContext
      );
      console.log("req", req);
      setCctpRequest(req);
      // create new resolver, passing the set of routes to consider
      const resolver = wh.resolver([
        routes.CCTPRoute, // manual CCTP
      ]);
      console.log("resolver", resolver);
      const route = await resolver.findRoutes(req);
      console.log("route", route);
      const cctpRoute = route[0];
      setCctpRoute(cctpRoute);
    };

    initializeRoute();
  }, [selectedSourceChain]);

  useEffect(() => {
    const getBalances = async () => {
      if (!wormholeContext) {
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
            testnetChainTokens[selectedSourceChain].tokenId.address,
          ]);

        const currentAmount =
          result[testnetChainTokens[selectedSourceChain].tokenId.address];

        const usdcBalance = amountUtils.fromBaseUnits(
          currentAmount ?? BigInt(0),
          testnetChainTokens[selectedSourceChain].decimals
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

    // TODO what is nativeGas for?
    const transferParams = { amount, options: { nativeGas: 0 } };

    //const cctpRoute = route[0];
    const validated = await cctpRoute.validate(cctpRequest, transferParams);
    if (!validated.valid) {
      console.log("invalid", validated.valid);
      throw validated.error;
    }
    const quote = await cctpRoute.quote(cctpRequest, validated.params);
    if (!quote.success) {
      console.log("quote failed", quote.success);
      throw quote.error;
    }
    const signer = new Signer(
      selectedSourceChain,
      sourceWallet.getAddress()!,
      {},
      sourceWallet
    );
    console.log("quote", quote);
    setProgress(0); // Reset progress
    setTransactionETA(quote.eta ?? 0);
    setStartTime(Date.now()); // Start the timer
    // initiate transfer
    setTransactionInitiated(true);
    let receipt = await cctpRoute.initiate(
      cctpRequest,
      signer,
      quote,
      Wormhole.chainAddress(
        "Aptos",
        "0x4bc9014919924c620b0b3cc370af637cb0aee3f73a0a525a28fe7e7a376338bc"
      )
    );
    console.log("Initiated transfer with receipt: ", receipt);

    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // Initial delay of 1 second

    while (retries < maxRetries) {
      try {
        for await (receipt of cctpRoute.track(receipt, 120 * 1000)) {
          if (receipt.state >= TransferState.SourceInitiated) {
            setTransactionReceipt(receipt);
            console.log("Receipt is on track ", receipt);
            return;
          }
        }
      } catch (e) {
        console.error(
          `Error tracking transfer (attempt ${retries + 1} / ${maxRetries}):`,
          e
        );
        const delay = baseDelay * Math.pow(2, retries); // Exponential backoff
        await sleep(delay);
        retries++;
      }
    }
  };

  const onClaimClick = async () => {
    if (!wallet) {
      throw new Error("Wallet is not initialized");
    }

    if (!cctpRoute) {
      throw new Error("Route is not initialized");
    }

    if (!transactionReceipt) {
      throw new Error("Transaction receipt is not initialized");
    }

    const signer = new AptosSigner(
      "Aptos",
      account?.address!,
      {},
      aptosWalletContext
    );

    if (routes.isManual(cctpRoute)) {
      const receipt = await cctpRoute.complete(signer, transactionReceipt);
      console.log("Claim receipt: ", receipt);
    } else {
      // Should be unreachable
      return undefined;
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <Card>
        <CardContent className="flex flex-col gap-8">
          {/*From*/}
          <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between">
              <p>From:</p>
              <p>
                <SolanaWalletSelector
                  setSourceWalletAddress={setSourceWalletAddress}
                  setSourceWallet={setSourceWallet}
                />
              </p>
            </div>
            <ChainSelect
              setSelectedSourceChain={setSelectedSourceChain}
              selectedSourceChain={selectedSourceChain}
            />
          </div>

          {/*To*/}
          <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between">
              <p>To:</p>
              <p>
                <WalletSelector />
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-[300px] gap-6 justify-start"
              disabled
            >
              <>
                <img
                  src={chainToIcon("Aptos" as any)}
                  alt="Aptos"
                  height="32px"
                  width="32px"
                />
                <span className="ml-2">USDC</span>
              </>
            </Button>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
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
          <Button
            onClick={onSwapClick}
            disabled={!sourceWallet || !connected || amount === "0"}
          >
            Confirm
          </Button>
          {/* {transactionInitiated && <Progress value={50} />} */}
          <Progress value={50} />
          {transactionReceipt && <Button onClick={onClaimClick}>Claim</Button>}
        </CardContent>
      </Card>
    </div>
  );
};
