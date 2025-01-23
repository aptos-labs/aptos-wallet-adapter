// src/providers/wormhole/index.ts
import {
  chainToPlatform,
  routes,
  Wormhole,
  wormhole,
  TransferState
} from "@wormhole-foundation/sdk";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";

// src/utils/logger.ts
var logger = {
  log: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.error(...args);
    }
  }
};

// src/providers/wormhole/index.ts
import {
  Network,
  sleep as sleep2
} from "@aptos-labs/ts-sdk";

// src/providers/wormhole/signers/AptosLocalSigner.ts
import {
  Aptos,
  AptosConfig,
  Network as AptosNetwork
} from "@aptos-labs/ts-sdk";
var AptosLocalSigner = class {
  constructor(chain, options, wallet, feePayerAccount) {
    this._chain = chain;
    this._options = options;
    this._wallet = wallet;
    this._sponsorAccount = feePayerAccount;
    this._claimedTransactionHashes = "";
  }
  chain() {
    return this._chain;
  }
  address() {
    return this._wallet.accountAddress.toString();
  }
  claimedTransactionHashes() {
    return this._claimedTransactionHashes;
  }
  async signAndSend(txs) {
    console.log("Signer signAndSend txs", txs);
    const txHashes = [];
    for (const tx of txs) {
      const txId = await signAndSendTransaction(
        tx,
        this._wallet,
        this._sponsorAccount
      );
      txHashes.push(txId);
      this._claimedTransactionHashes = txId;
    }
    return txHashes;
  }
};
async function signAndSendTransaction(request, wallet, sponsorAccount) {
  if (!wallet) {
    throw new Error("Wallet is undefined");
  }
  const payload = request.transaction;
  payload.functionArguments = payload.functionArguments.map((a) => {
    if (a instanceof Uint8Array) {
      return Array.from(a);
    } else if (typeof a === "bigint") {
      return a.toString();
    } else {
      return a;
    }
  });
  const aptosConfig = new AptosConfig({
    network: AptosNetwork.TESTNET
  });
  const aptos2 = new Aptos(aptosConfig);
  const txnToSign = await aptos2.transaction.build.simple({
    data: payload,
    sender: wallet.accountAddress.toString(),
    withFeePayer: sponsorAccount ? true : false
  });
  const senderAuthenticator = await aptos2.transaction.sign({
    signer: wallet,
    transaction: txnToSign
  });
  const txnToSubmit = {
    transaction: txnToSign,
    senderAuthenticator
  };
  if (sponsorAccount) {
    const feePayerSignerAuthenticator = aptos2.transaction.signAsFeePayer({
      signer: sponsorAccount,
      transaction: txnToSign
    });
    txnToSubmit.feePayerAuthenticator = feePayerSignerAuthenticator;
  }
  const response = await aptos2.transaction.submit.simple(txnToSubmit);
  const tx = await aptos2.waitForTransaction({
    transactionHash: response.hash
  });
  return tx.hash;
}

// src/providers/wormhole/signers/SolanaSigner.ts
import {
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  determinePriorityFee,
  determinePriorityFeeTritonOne
} from "@wormhole-foundation/sdk-solana";
import { Connection } from "@solana/web3.js";
async function signAndSendTransaction2(request, wallet, options) {
  var _a;
  if (!wallet)
    throw new Error("Wallet not found");
  const commitment = (_a = options == null ? void 0 : options.commitment) != null ? _a : "finalized";
  const connection = new Connection("https://api.devnet.solana.com");
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash(commitment);
  const transaction = request.transaction.transaction;
  const unsignedTx = await setPriorityFeeInstructions(
    connection,
    blockhash,
    lastValidBlockHeight,
    request
  );
  let confirmTransactionPromise = null;
  let confirmedTx = null;
  let txSendAttempts = 1;
  let signature = "";
  const tx = await wallet.signTransaction(unsignedTx);
  const serializedTx = tx.serialize();
  const sendOptions = {
    skipPreflight: true,
    maxRetries: 0,
    preFlightCommitment: commitment
  };
  signature = await connection.sendRawTransaction(serializedTx, sendOptions);
  confirmTransactionPromise = connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight
    },
    commitment
  );
  const txRetryInterval = 5e3;
  while (!confirmedTx) {
    confirmedTx = await Promise.race([
      confirmTransactionPromise,
      new Promise(
        (resolve) => setTimeout(() => {
          resolve(null);
        }, txRetryInterval)
      )
    ]);
    if (confirmedTx) {
      break;
    }
    console.log(
      `Tx not confirmed after ${txRetryInterval * txSendAttempts++}ms, resending`
    );
    try {
      await connection.sendRawTransaction(serializedTx, sendOptions);
    } catch (e) {
      console.error("Failed to resend transaction:", e);
    }
  }
  if (confirmedTx.value.err) {
    let errorMessage = `Transaction failed: ${confirmedTx.value.err}`;
    if (typeof confirmedTx.value.err === "object") {
      try {
        errorMessage = `Transaction failed: ${JSON.stringify(
          confirmedTx.value.err,
          (_key, value) => typeof value === "bigint" ? value.toString() : value
        )}`;
      } catch (e) {
        errorMessage = `Transaction failed: Unknown error`;
      }
    }
    throw new Error(`Transaction failed: ${errorMessage}`);
  }
  return signature;
}
async function setPriorityFeeInstructions(connection, blockhash, lastValidBlockHeight, request) {
  const unsignedTx = request.transaction.transaction;
  const computeBudgetIxFilter = (ix) => ix.programId.toString() !== "ComputeBudget111111111111111111111111111111";
  unsignedTx.recentBlockhash = blockhash;
  unsignedTx.lastValidBlockHeight = lastValidBlockHeight;
  unsignedTx.instructions = unsignedTx.instructions.filter(
    computeBudgetIxFilter
  );
  unsignedTx.add(
    ...await createPriorityFeeInstructions(connection, unsignedTx)
  );
  if (request.transaction.signers) {
    unsignedTx.partialSign(...request.transaction.signers);
  }
  return unsignedTx;
}
async function createPriorityFeeInstructions(connection, transaction, commitment) {
  let unitsUsed = 2e5;
  let simulationAttempts = 0;
  simulationLoop:
    while (true) {
      const response = await connection.simulateTransaction(
        transaction
      );
      if (response.value.err) {
        if (checkKnownSimulationError(response.value)) {
          if (simulationAttempts < 5) {
            simulationAttempts++;
            await sleep(1e3);
            continue simulationLoop;
          }
        } else if (simulationAttempts < 3) {
          simulationAttempts++;
          await sleep(1e3);
          continue simulationLoop;
        }
        throw new Error(
          `Simulation failed: ${JSON.stringify(response.value.err)}
Logs:
${(response.value.logs || []).join("\n  ")}`
        );
      } else {
        if (response.value.unitsConsumed) {
          unitsUsed = response.value.unitsConsumed;
        }
        break;
      }
    }
  const unitBudget = Math.floor(unitsUsed * 1.2);
  const instructions = [];
  instructions.push(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: unitBudget
    })
  );
  const percentile = 0.9;
  const percentileMultiple = 1;
  const min = 1e5;
  const max = 1e8;
  const calculateFee = async (rpcProvider2) => {
    if (rpcProvider2 === "triton") {
      try {
        const fee2 = await determinePriorityFeeTritonOne(
          connection,
          transaction,
          percentile,
          percentileMultiple,
          min,
          max
        );
        return {
          fee: fee2,
          methodUsed: "triton"
        };
      } catch (e) {
        console.warn(`Failed to determine priority fee using Triton RPC:`, e);
      }
    }
    try {
      const fee2 = await determinePriorityFee(
        connection,
        transaction,
        percentile,
        percentileMultiple,
        min,
        max
      );
      return {
        fee: fee2,
        methodUsed: "default"
      };
    } catch (e) {
      console.warn(`Failed to determine priority fee using Triton RPC:`, e);
      return {
        fee: min,
        methodUsed: "minimum"
      };
    }
  };
  const rpcProvider = determineRpcProvider(connection.rpcEndpoint);
  const { fee, methodUsed } = await calculateFee(rpcProvider);
  const maxFeeInSol = fee / 1e6 / LAMPORTS_PER_SOL * unitBudget;
  console.table({
    "RPC Provider": rpcProvider,
    "Method used": methodUsed,
    "Percentile used": percentile,
    "Multiple used": percentileMultiple,
    "Compute budget": unitBudget,
    "Priority fee": fee,
    "Max fee in SOL": maxFeeInSol
  });
  instructions.push(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: fee })
  );
  return instructions;
}
function checkKnownSimulationError(response) {
  const errors = {};
  if (response.err === "BlockhashNotFound") {
    errors["BlockhashNotFound"] = "Blockhash not found during simulation. Trying again.";
  }
  if (response.logs) {
    for (const line of response.logs) {
      if (line.includes("SlippageToleranceExceeded")) {
        errors["SlippageToleranceExceeded"] = "Slippage failure during simulation. Trying again.";
      }
      if (line.includes("RequireGteViolated")) {
        errors["RequireGteViolated"] = "Swap instruction failure during simulation. Trying again.";
      }
    }
  }
  if (isEmptyObject(errors)) {
    return false;
  }
  console.table(errors);
  return true;
}
async function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
var isEmptyObject = (value) => {
  if (value === null || value === void 0) {
    return true;
  }
  for (const key in value) {
    if (value.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
};
function determineRpcProvider(endpoint) {
  if (endpoint.includes("rpcpool.com")) {
    return "triton";
  } else if (endpoint.includes("helius-rpc.com")) {
    return "helius";
  } else if (endpoint.includes("rpc.ankr.com")) {
    return "ankr";
  } else {
    return "unknown";
  }
}

// src/providers/wormhole/signers/EthereumSigner.ts
import { getBigInt } from "ethers";
async function signAndSendTransaction3(request, wallet, chainName, options) {
  if (!wallet || !wallet.sendTransaction) {
    throw new Error("wallet.sendTransaction is undefined");
  }
  const actualChainId = await wallet.getConnectedNetwork();
  if (!actualChainId)
    throw new Error("No signer found for chain" + chainName);
  const expectedChainId = request.transaction.chainId ? getBigInt(request.transaction.chainId) : void 0;
  if (!actualChainId || !expectedChainId || BigInt(actualChainId) !== expectedChainId) {
    throw new Error(
      `Signer is not connected to the right chain. Expected ${expectedChainId}, got ${actualChainId}`
    );
  }
  const txHash = await wallet.sendTransaction(request.transaction);
  return txHash;
}

// src/providers/wormhole/signers/SuiSigner.ts
async function signAndSendTransaction4(request, wallet) {
  if (!wallet || !wallet.sendTransaction) {
    throw new Error("wallet.sendTransaction is undefined");
  }
  const response = await wallet.sendTransaction({
    transactionBlock: request.transaction
  });
  return response == null ? void 0 : response.id;
}

// src/providers/wormhole/signers/index.ts
var Signer = class {
  constructor(chain, address, options, wallet) {
    this._chain = chain;
    this._address = address;
    this._options = options;
    this._wallet = wallet;
  }
  chain() {
    return this._chain.displayName;
  }
  address() {
    return this._address;
  }
  async signAndSend(txs) {
    const txHashes = [];
    for (const tx of txs) {
      const txId = await signAndSendTransaction5(
        this._chain,
        tx,
        this._wallet,
        this._options
      );
      txHashes.push(txId);
    }
    return txHashes;
  }
};
var signAndSendTransaction5 = async (chain, request, wallet, options = {}) => {
  if (!wallet) {
    throw new Error("wallet is undefined");
  }
  if (chain.context === "Solana") {
    const signature = await signAndSendTransaction2(
      request,
      wallet,
      options
    );
    return signature;
  } else if (chain.context === "Ethereum") {
    const tx = await signAndSendTransaction3(
      request,
      wallet,
      chain.displayName,
      options
    );
    return tx;
  } else if (chain.context === "Sui") {
    const tx = await signAndSendTransaction4(
      request,
      wallet
    );
    return tx;
  } else {
    throw new Error(`Unsupported chain: ${chain}`);
  }
};

// src/providers/wormhole/config/types.ts
var Context = /* @__PURE__ */ ((Context2) => {
  Context2["ETH"] = "Ethereum";
  Context2["TERRA"] = "Terra";
  Context2["XPLA"] = "XPLA";
  Context2["SOLANA"] = "Solana";
  Context2["ALGORAND"] = "Algorand";
  Context2["NEAR"] = "Near";
  Context2["APTOS"] = "Aptos";
  Context2["SUI"] = "Sui";
  Context2["OTHER"] = "OTHER";
  return Context2;
})(Context || {});

// src/providers/wormhole/config/testnet/chains.ts
var testnetChains = {
  Sepolia: {
    key: "Sepolia",
    id: 10002,
    context: "Ethereum" /* ETH */,
    finalityThreshold: 0,
    displayName: "Sepolia",
    explorerUrl: "https://sepolia.etherscan.io/",
    explorerName: "Etherscan",
    gasToken: "ETHsepolia",
    chainId: 11155111,
    icon: "Ethereum",
    maxBlockSearch: 2e3,
    symbol: "ETH",
    sdkName: "Sepolia",
    wrappedGasToken: "0xeef12A83EE5b7161D3873317c8E0E7B76e0B5D9c"
  },
  Solana: {
    key: "Solana",
    id: 1,
    context: "Solana" /* SOLANA */,
    finalityThreshold: 32,
    displayName: "Solana",
    explorerUrl: "https://explorer.solana.com/",
    explorerName: "Solana Explorer",
    gasToken: "SOL",
    chainId: 0,
    icon: "Solana",
    maxBlockSearch: 2e3,
    symbol: "SOL",
    sdkName: "Solana",
    wrappedGasToken: "So11111111111111111111111111111111111111112"
  }
};
var AptosTestnetChain = {
  key: "Aptos",
  id: 22,
  context: "Aptos" /* APTOS */,
  finalityThreshold: 0,
  displayName: "Aptos",
  explorerUrl: "https://explorer.aptoslabs.com?network=testnet",
  explorerName: "Aptos Explorer",
  gasToken: "APT",
  chainId: 0,
  icon: "Aptos",
  maxBlockSearch: 0,
  symbol: "APT",
  sdkName: "Aptos"
};

// src/providers/wormhole/config/testnet/tokens.ts
var testnetTokens = {
  Avalanche: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Avalanche",
      address: "0x5425890298aed601595a70AB815c96711a31Bc65"
    }
  },
  Sepolia: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Sepolia",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
    }
  },
  Solana: {
    symbol: "USDC",
    tokenId: {
      chain: "Solana",
      address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
    },
    icon: "USDC",
    decimals: 6
  },
  Sui: {
    symbol: "USDC",
    tokenId: {
      chain: "Sui",
      address: "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC"
    },
    icon: "USDC",
    decimals: 6
  }
};
var AptosTestnetUSDCToken = {
  symbol: "USDC",
  decimals: 6,
  tokenId: {
    chain: "Aptos",
    address: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832"
  },
  icon: "USDC"
};

// src/providers/wormhole/config/mainnet/chains.ts
var mainnetChains = {
  Ethereum: {
    key: "Ethereum",
    id: 2,
    context: "Ethereum" /* ETH */,
    finalityThreshold: 64,
    displayName: "Ethereum",
    explorerUrl: "https://etherscan.io/",
    explorerName: "Etherscan",
    gasToken: "ETH",
    chainId: 1,
    icon: "Ethereum",
    maxBlockSearch: 2e3,
    symbol: "ETH",
    sdkName: "Ethereum"
  },
  Solana: {
    key: "Solana",
    id: 1,
    context: "Solana" /* SOLANA */,
    finalityThreshold: 32,
    displayName: "Solana",
    explorerUrl: "https://explorer.solana.com/",
    explorerName: "Solana Explorer",
    gasToken: "SOL",
    chainId: 0,
    icon: "Solana",
    maxBlockSearch: 2e3,
    symbol: "SOL",
    sdkName: "Solana"
  }
};
var AptosMainnetChain = {
  key: "Aptos",
  id: 22,
  context: "Aptos",
  finalityThreshold: 0,
  displayName: "Aptos",
  explorerUrl: "https://explorer.aptoslabs.com/",
  explorerName: "Aptos Explorer",
  gasToken: "APT",
  chainId: 0,
  icon: "Aptos",
  maxBlockSearch: 0,
  symbol: "APT"
};

// src/providers/wormhole/config/mainnet/tokens.ts
var mainnetTokens = {
  Ethereum: {
    symbol: "USDC",
    tokenId: {
      chain: "Ethereum",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    icon: "USDC",
    decimals: 6
  },
  Solana: {
    symbol: "USDC",
    tokenId: {
      chain: "Solana",
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    },
    icon: "USDC",
    decimals: 6
  },
  Sui: {
    symbol: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Sui",
      address: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC"
    },
    icon: "USDC"
  }
};
var AptosMainnetUSDCToken = {
  symbol: "USDC",
  tokenId: {
    chain: "Aptos",
    address: "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b"
  },
  icon: "USDC",
  decimals: 6
};

// src/providers/wormhole/index.ts
var WormholeProvider = class {
  constructor(core) {
    this.CHAINS = testnetChains;
    this.TOKENS = testnetTokens;
    this.APTOS_TOKEN = AptosTestnetUSDCToken;
    var _a;
    this.crossChainCore = core;
    if (((_a = core._dappConfig) == null ? void 0 : _a.network) === Network.MAINNET) {
      this.CHAINS = mainnetChains;
      this.TOKENS = mainnetTokens;
      this.APTOS_TOKEN = AptosMainnetUSDCToken;
    } else {
      this.CHAINS = testnetChains;
      this.TOKENS = testnetTokens;
      this.APTOS_TOKEN = AptosTestnetUSDCToken;
    }
  }
  get wormholeContext() {
    return this._wormholeContext;
  }
  async setWormholeContext(sourceChain) {
    var _a;
    const dappNetwork = (_a = this.crossChainCore._dappConfig) == null ? void 0 : _a.network;
    if (dappNetwork === Network.DEVNET) {
      throw new Error("Devnet is not supported on Wormhole");
    }
    if (!sourceChain) {
      throw new Error("Origin chain not selected");
    }
    const isMainnet = dappNetwork === Network.MAINNET;
    const platforms = [aptos, solana, evm];
    const wh = await wormhole(isMainnet ? "Mainnet" : "Testnet", platforms);
    this._wormholeContext = wh;
  }
  async getWormholeCctpRoute(sourceChain) {
    if (!this._wormholeContext) {
      throw new Error("Wormhole context not initialized");
    }
    const { sourceToken, destToken } = this.getTokenInfo(sourceChain);
    const sourceContext = this._wormholeContext.getPlatform(chainToPlatform(sourceChain)).getChain(sourceChain);
    logger.log("sourceContext", sourceContext);
    const destContext = this._wormholeContext.getPlatform(chainToPlatform("Aptos")).getChain("Aptos");
    logger.log("destContext", destContext);
    const req = await routes.RouteTransferRequest.create(
      this._wormholeContext,
      {
        source: sourceToken,
        destination: destToken
      },
      sourceContext,
      destContext
    );
    const resolver = this._wormholeContext.resolver([
      routes.CCTPRoute
    ]);
    const route = await resolver.findRoutes(req);
    const cctpRoute = route[0];
    return { route: cctpRoute, request: req };
  }
  async getQuote(input) {
    const { amount, sourceChain } = input;
    if (!this._wormholeContext) {
      await this.setWormholeContext(sourceChain);
    }
    const { route, request } = await this.getWormholeCctpRoute(sourceChain);
    this.wormholeRoute = route;
    this.wormholeRequest = request;
    const transferParams = { amount, options: { nativeGas: 0 } };
    const validated = await route.validate(request, transferParams);
    if (!validated.valid) {
      logger.log("invalid", validated.valid);
      throw validated.error;
    }
    const quote = await route.quote(request, validated.params);
    if (!quote.success) {
      logger.log("quote failed", quote.success);
      throw quote.error;
    }
    this.wormholeQuote = quote;
    logger.log("quote", quote);
    return quote;
  }
  async startCCTPTransfer(input) {
    const { sourceChain, wallet, destinationAddress } = input;
    if (!this._wormholeContext) {
      await this.setWormholeContext(sourceChain);
    }
    if (!this.wormholeRoute || !this.wormholeRequest || !this.wormholeQuote) {
      throw new Error("Wormhole route, request, or quote not initialized");
    }
    let signerAddress;
    const chainContext = this.getChainConfig(sourceChain).context;
    const currentAccount = await wallet.getAccount();
    if (chainContext === "Solana") {
      signerAddress = currentAccount.publicKey.toString();
    } else {
      signerAddress = currentAccount.address;
    }
    logger.log("signerAddress", signerAddress);
    const signer = new Signer(
      this.getChainConfig(sourceChain),
      signerAddress,
      {},
      wallet
    );
    let receipt = await this.wormholeRoute.initiate(
      this.wormholeRequest,
      signer,
      this.wormholeQuote,
      Wormhole.chainAddress("Aptos", destinationAddress.toString())
    );
    const originChainTxnId = "originTxs" in receipt ? receipt.originTxs[receipt.originTxs.length - 1].txid : void 0;
    return { originChainTxnId: originChainTxnId || "", receipt };
  }
  async initiateCCTPTransfer(input) {
    var _a;
    if (((_a = this.crossChainCore._dappConfig) == null ? void 0 : _a.network) === Network.DEVNET) {
      throw new Error("Devnet is not supported on Wormhole");
    }
    if (!this.wormholeRoute || !this.wormholeRequest || !this.wormholeQuote) {
      throw new Error("Wormhole route, request, or quote not initialized");
    }
    let { originChainTxnId, receipt } = await this.startCCTPTransfer(input);
    const { mainSigner, sponsorAccount } = input;
    logger.log("mainSigner", mainSigner.accountAddress.toString());
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1e3;
    while (retries < maxRetries) {
      try {
        for await (receipt of this.wormholeRoute.track(receipt, 120 * 1e3)) {
          if (receipt.state >= TransferState.SourceInitiated) {
            logger.log("Receipt is on track ", receipt);
            try {
              const signer = new AptosLocalSigner(
                "Aptos",
                {},
                mainSigner,
                sponsorAccount ? sponsorAccount : void 0
              );
              if (routes.isManual(this.wormholeRoute)) {
                const circleAttestationReceipt = await this.wormholeRoute.complete(signer, receipt);
                logger.log("Claim receipt: ", circleAttestationReceipt);
                const destinationChainTxnId = signer.claimedTransactionHashes();
                return { destinationChainTxnId, originChainTxnId };
              } else {
                return { destinationChainTxnId: "", originChainTxnId };
              }
            } catch (e) {
              console.error("Failed to claim", e);
              return { destinationChainTxnId: "", originChainTxnId };
            }
          }
        }
      } catch (e) {
        console.error(
          `Error tracking transfer (attempt ${retries + 1} / ${maxRetries}):`,
          e
        );
        const delay = baseDelay * Math.pow(2, retries);
        await sleep2(delay);
        retries++;
      }
    }
    return { destinationChainTxnId: "", originChainTxnId };
  }
  getChainConfig(chain) {
    const chainConfig = this.CHAINS[chain];
    if (!chainConfig) {
      throw new Error(`Chain config not found for chain: ${chain}`);
    }
    return chainConfig;
  }
  getTokenInfo(sourceChain) {
    const sourceToken = Wormhole.tokenId(
      this.TOKENS[sourceChain].tokenId.chain,
      this.TOKENS[sourceChain].tokenId.address
    );
    const destToken = Wormhole.tokenId(
      this.APTOS_TOKEN.tokenId.chain,
      this.APTOS_TOKEN.tokenId.address
    );
    return { sourceToken, destToken };
  }
};

// src/CrossChainCore.ts
var CrossChainCore = class {
  constructor(args) {
    this._dappConfig = args.dappConfig;
  }
  getProvider(providerType) {
    switch (providerType) {
      case "Wormhole":
        return new WormholeProvider(this);
      default:
        throw new Error(`Unknown provider: ${providerType}`);
    }
  }
};

// src/index.ts
import { Network as Network2 } from "@aptos-labs/ts-sdk";
export {
  AptosMainnetChain,
  AptosMainnetUSDCToken,
  AptosTestnetChain,
  AptosTestnetUSDCToken,
  Context,
  CrossChainCore,
  Network2 as Network,
  WormholeProvider,
  mainnetChains,
  mainnetTokens,
  testnetChains,
  testnetTokens
};
//# sourceMappingURL=index.mjs.map