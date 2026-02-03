import {
  Account,
  AccountAddress,
  AccountAuthenticator,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Network as AptosNetwork,
  Deserializer,
  EntryFunctionArgumentTypes,
  InputGenerateTransactionPayloadData,
  ScriptFunctionArgumentTypes,
  Serializer,
  SimpleEntryFunctionArgumentTypes,
  U64,
} from "@aptos-labs/ts-sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { Network } from "@wormhole-foundation/sdk";
import {
  AptosChains,
  AptosUnsignedTransaction,
} from "@wormhole-foundation/sdk-aptos";
import { GasStationApiKey } from "..";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";

export async function signAndSendTransaction(
  request: AptosUnsignedTransaction<Network, AptosChains>,
  wallet: AdapterWallet,
  sponsorAccount: Account | GasStationApiKey | undefined,
) {
  if (!wallet) {
    throw new Error("wallet.sendTransaction is undefined").message;
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

  const aptosConfig = new AptosConfig({
    network: AptosNetwork.TESTNET,
  });
  const aptos = new Aptos(aptosConfig);

  // TODO: handle mainnet
  const contractAddress = AptosNetwork.TESTNET
    ? "0x5e2d961f06cd27aa07554a39d55f5ce1e58dff35d803c3529b1cd5c4fa3ab584"
    : "0x1";

  // Wormhole resturns a script function transaction payload, but due to a ts-sdk version mismatch,
  // linter complains on different types - so need to first convert to unknown and then to ScriptFunctionArgumentTypes.
  // Also, tranfering the arguments as it brings some errors (which not sure if bug or not), so we first extract them
  // and then tranform them into the functionArguments.
  const functionArguments = extractFunctionArguments(
    payload.functionArguments as unknown as ScriptFunctionArgumentTypes[],
  );

  const transactionData: InputGenerateTransactionPayloadData = {
    // a custom function to withdraw tokens from the aptos chain, published here on testnet:
    // https://explorer.aptoslabs.com/account/0x5e2d961f06cd27aa07554a39d55f5ce1e58dff35d803c3529b1cd5c4fa3ab584/modules/code/withdraw?network=testnet
    function: `${contractAddress}::withdraw::deposit_for_burn`,
    functionArguments,
  };

  const accountFeature = wallet.features["aptos:account"];
  if (!accountFeature) {
    throw new Error("Wallet does not support aptos:account feature");
  }
  const account = await accountFeature.account();

  const txnToSign = await aptos.transaction.build.simple({
    data: transactionData,
    sender: account.address.toString(),
    withFeePayer: sponsorAccount ? true : false,
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

  if (sponsorAccount) {
    if (typeof sponsorAccount === "string") {
      // TODO: handle gas station integration here
    } else {
      const feePayerSignerAuthenticator = aptos.transaction.signAsFeePayer({
        signer: sponsorAccount as Account,
        transaction: txnToSign,
      });
      txnToSubmit.feePayerAuthenticator = feePayerSignerAuthenticator;
    }
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
