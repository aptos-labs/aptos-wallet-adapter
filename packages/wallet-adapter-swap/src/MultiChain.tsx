import "./global.css";
import { Card, CardContent } from "./ui/card";
import { WalletSelector } from "./walletSelector/aptos/WalletSelector";
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
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";

import { SolanaWalletSelector } from "./walletSelector/solana/SolanaWalletSelector";
import { AptosTestnetUSDCToken, testnetChainTokens } from "./utils";
import { ChainSelect } from "./ChainSelect";
import { Input } from "./ui/input";
import { Signer } from "./signer/Signer";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosSigner } from "./signer/AptosSigner";
import { sleep } from "./signer/SolanaSigner";
import { EthereumWalletSelector } from "./walletSelector/ethereum/EthereumWalletSelector";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";

export const MultiChain = () => {
  const [sourceWallet, setSourceWallet] = useState<Wallet | null>(null);
  const [selectedSourceChain, setSelectedSourceChain] =
    useState<Chain>("Solana");
  const [amount, setAmount] = useState<string>("0");

  const [transactionReceipt, setTransactionReceipt] =
    useState<routes.Receipt<AttestationReceipt> | null>(null);

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
    if (!account) {
      throw new Error("Destination account is not initialized");
    }

    // TODO what is nativeGas for?
    const transferParams = { amount, options: { nativeGas: 0 } };

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
    // initiate transfer
    let receipt = await cctpRoute.initiate(
      cctpRequest,
      signer,
      quote,
      Wormhole.chainAddress("Aptos", account?.address)
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
        <CardContent className="flex flex-col gap-8 pt-6">
          {/*From*/}
          <div className="flex flex-col gap-6">
            <div className="flex flex-row w-full">
              <ChainSelect
                setSelectedSourceChain={setSelectedSourceChain}
                selectedSourceChain={selectedSourceChain}
              />
            </div>
            <div className="flex flex-row justify-between">
              <p>From:</p>
              <p>
                {selectedSourceChain === "Solana" ? (
                  <SolanaWalletSelector setSourceWallet={setSourceWallet} />
                ) : (
                  <EthereumWalletSelector setSourceWallet={setSourceWallet} />
                )}
              </p>
            </div>
          </div>

          {/*To*/}
          <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between">
              <p>To:</p>
              <p>
                <WalletSelector />
              </p>
            </div>
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
          {transactionReceipt && <Button onClick={onClaimClick}>Claim</Button>}
        </CardContent>
      </Card>
    </div>
  );
};
