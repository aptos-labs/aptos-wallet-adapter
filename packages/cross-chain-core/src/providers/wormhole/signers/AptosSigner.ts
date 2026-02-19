import {
  Account,
  AccountAddress,
  AccountAuthenticator,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Network as AptosNetwork,
  Deserializer,
  InputGenerateTransactionPayloadData,
  ScriptFunctionArgumentTypes,
} from "@aptos-labs/ts-sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { Network } from "@wormhole-foundation/sdk";
import {
  AptosChains,
  AptosUnsignedTransaction,
} from "@wormhole-foundation/sdk-aptos";
import { GasStationApiKey } from "..";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import { GasStationClient, GasStationTransactionSubmitter } from "@aptos-labs/gas-station-client";
import { CrossChainCore } from "../../../CrossChainCore";

export async function signAndSendTransaction(
  request: AptosUnsignedTransaction<Network, AptosChains>,
  wallet: AdapterWallet,
  sponsorAccount: Account | GasStationApiKey | undefined,
  dappNetwork: AptosNetwork,
  crossChainCore?: CrossChainCore,
) {
  if (!wallet) {
    throw new Error("wallet.sendTransaction is undefined");
  }

  const payload = request.transaction;
  // The wallets do not handle Uint8Array serialization
  payload.functionArguments = payload.functionArguments.map((a: any) => {
    if (a instanceof Uint8Array) {
      return Array.from(a);
    } else if (typeof a === "bigint") {
      return a.toString();
    } else {
      return a;
    }
  });


  // Configure Aptos client based on sponsor type
  let aptosConfig: AptosConfig;
  const useGasStation = sponsorAccount && !isAccount(sponsorAccount);

  if (useGasStation) {
    // Gas station flow - configure with plugin upfront
    const gasStationClient = new GasStationClient({
      network: dappNetwork,
      apiKey: sponsorAccount[dappNetwork as AptosNetwork.TESTNET | AptosNetwork.MAINNET],
    });
    const transactionSubmitter = new GasStationTransactionSubmitter(gasStationClient);
    
    aptosConfig = new AptosConfig({
      network: dappNetwork,
      pluginSettings: {
        TRANSACTION_SUBMITTER: transactionSubmitter,
      },
    });
  } else {
    // Regular flow or Account sponsor
    aptosConfig = new AptosConfig({
      network: dappNetwork,
    });
  }

  const aptos = new Aptos(aptosConfig);

  // Wormhole resturns a script function transaction payload, but due to a ts-sdk version mismatch,
  // linter complains on different types - so need to first convert to unknown and then to ScriptFunctionArgumentTypes.
  // Also, tranfering the arguments as it brings some errors (which not sure if bug or not), so we first extract them
  // and then tranform them into the functionArguments.
  const functionArguments = extractFunctionArguments(
    payload.functionArguments as unknown as ScriptFunctionArgumentTypes[],
  );

  // a custom function to withdraw tokens from the aptos chain,
  // published testnet:
  // https://explorer.aptoslabs.com/account/0x5e2d961f06cd27aa07554a39d55f5ce1e58dff35d803c3529b1cd5c4fa3ab584/modules/code/withdraw?network=testnet
  // published mainnet:
  // https://explorer.aptoslabs.com/account/0x5e2d961f06cd27aa07554a39d55f5ce1e58dff35d803c3529b1cd5c4fa3ab584/modules/code/withdraw?network=mainnet
  const withdrawFunction =
    "0x5e2d961f06cd27aa07554a39d55f5ce1e58dff35d803c3529b1cd5c4fa3ab584::withdraw::deposit_for_burn";
  const transactionData: InputGenerateTransactionPayloadData = {
    function: withdrawFunction,
    functionArguments,
  };

  const expireTimestamp = crossChainCore?._dappConfig?.getExpireTimestamp?.();
  const txnToSign = await aptos.transaction.build.simple({
    data: transactionData,
    sender: (
      await wallet.features["aptos:account"]?.account()
    ).address.toString(),
    withFeePayer: sponsorAccount ? true : false,
    ...(expireTimestamp ? { options: { expireTimestamp } } : {}),
  });

  const response =
    await wallet.features["aptos:signTransaction"]?.signTransaction(txnToSign);

  if (response?.status === UserResponseStatus.REJECTED) {
    throw new Error("User has rejected the request");
  }

  const txnToSubmit: {
    transaction: AnyRawTransaction;
    senderAuthenticator: AccountAuthenticator;
    feePayerAuthenticator?: AccountAuthenticator;
  } = {
    transaction: txnToSign,
    senderAuthenticator: response.args,
  };

   // Only sign as fee payer if it's an Account (not gas station)
   if (sponsorAccount && isAccount(sponsorAccount)) {
    const feePayerSignerAuthenticator = aptos.transaction.signAsFeePayer({
      signer: sponsorAccount,
      transaction: txnToSign,
    });
    txnToSubmit.feePayerAuthenticator = feePayerSignerAuthenticator;
  }

  const txnSubmitted = await aptos.transaction.submit.simple(txnToSubmit);

  const tx = await aptos.waitForTransaction({
    transactionHash: txnSubmitted.hash,
  });

  return tx.hash;
}

/**
 * Extracts the function arguments from the function arguments array and tranform them into types the sdk can ready.
 *
 * Note: we assume the argument types are always [U64, U32, accountAddress, accountAddress] - even tho we use
 * Wormhole fix version in the package.json, if wormhole changes this, we need to update this function.
 * @param functionArguments - The function arguments array.
 * @returns The function arguments.
 */
function extractFunctionArguments(
  functionArguments: ScriptFunctionArgumentTypes[],
) {
  const deserializer1 = new Deserializer(functionArguments[0].bcsToBytes());
  const amount = deserializer1.deserializeU64();

  const deserializer2 = new Deserializer(functionArguments[1].bcsToBytes());
  const destination_domain = deserializer2.deserializeU32();

  const mint_recipient = new AccountAddress(functionArguments[2].bcsToBytes());

  const burn_token = new AccountAddress(functionArguments[3].bcsToBytes());

  return [amount, destination_domain, mint_recipient, burn_token];
}

export function isAccount(obj: Account | GasStationApiKey): obj is Account {
  return 'accountAddress' in obj;
}
