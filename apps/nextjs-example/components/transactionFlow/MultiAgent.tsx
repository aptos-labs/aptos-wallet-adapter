import {
  Account,
  AccountAuthenticator,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import { useState, useEffect } from "react";
import { aptosClient } from "../../utils";
import { useAlert } from "../AlertProvider";
import Button from "../Button";
import Col from "../Col";
import Row from "../Row";
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
type MultiAgentTransactionProps = {
  isSendableNetwork: (connected: boolean, network?: string) => boolean;
};

export default function MultiAgentTransaction({
  isSendableNetwork,
}: MultiAgentTransactionProps) {
  const { connected, account, network, signTransaction, submitTransaction } =
    useWallet();

  const [secondarySignerAccount, setSecondarySignerAccount] =
    useState<Account>();
  const [transactionToSubmit, setTransactionToSubmit] =
    useState<AnyRawTransaction | null>(null);
  const { setSuccessAlertHash } = useAlert();

  const [senderAuthenticator, setSenderAuthenticator] =
    useState<AccountAuthenticator>();
  const [secondarySignerAuthenticator, setSecondarySignerAuthenticator] =
    useState<AccountAuthenticator>();

  let sendable = isSendableNetwork(connected, network?.name);

  useEffect(() => {
    if (!sendable) return;
    if (!account) return;
    if (!network) return;

    const secondarySigner = Account.generate();

    // Generate a raw transaction using the SDK
    const generate = async (): Promise<AnyRawTransaction> => {
      const transactionToSign = await aptosClient(
        network?.name.toLowerCase()
      ).build.multiAgentTransaction({
        sender: account.address,
        secondarySignerAddresses: [secondarySigner.accountAddress],
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address, 1], // 1 is in Octas
        },
      });
      return transactionToSign;
    };

    // Fund secondary signer account to create it on chain
    const fundSecondarySigner = async () => {
      await aptosClient(network.name.toLowerCase()).fundAccount({
        accountAddress: secondarySigner.accountAddress.toString(),
        amount: 100_000_000,
      });
    };

    // Fund current connected account to create it on chain
    const fundCurrentAccount = async () => {
      await aptosClient(network.name.toLowerCase()).fundAccount({
        accountAddress: account.address,
        amount: 100_000_000,
      });
    };

    // We fund the secondary signer account to create it on chain
    // We fund the current connected account to create it on chain
    // Then we generate the transaction with the current connected account
    // as the sender and the secondary signer account
    fundSecondarySigner().then(() => {
      setSecondarySignerAccount(secondarySigner);
      fundCurrentAccount().then(() => {
        generate().then((transactionToSign) =>
          setTransactionToSubmit(transactionToSign)
        );
      });
    });
  }, [network, account, sendable]);

  const onSenderSignTransaction = async () => {
    if (!transactionToSubmit) {
      throw new Error("No Transaction to sign");
    }
    try {
      const authenticator = await signTransaction(transactionToSubmit);
      setSenderAuthenticator(authenticator);
    } catch (error) {
      console.error(error);
    }
  };

  const onSecondarySignerSignTransaction = async () => {
    if (!transactionToSubmit) {
      throw new Error("No Transaction to sign");
    }
    try {
      const authenticator = await signTransaction(transactionToSubmit);
      setSecondarySignerAuthenticator(authenticator);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitTransaction = async () => {
    if (!transactionToSubmit) {
      throw new Error("No Transaction to sign");
    }
    if (!senderAuthenticator) {
      throw new Error("No senderAuthenticator");
    }
    if (!secondarySignerAuthenticator) {
      throw new Error("No secondarySignerAuthenticator");
    }
    try {
      const response = await submitTransaction({
        transaction: transactionToSubmit,
        senderAuthenticator: senderAuthenticator,
        additionalSignersAuthenticators: [secondarySignerAuthenticator],
      });
      setSuccessAlertHash(response.hash, network?.name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Row>
        <Col title={true} border={true}>
          <h3>Multi Agent Transaction Flow</h3>
        </Col>
        <Col border={true}>
          <Button
            color={"blue"}
            onClick={onSenderSignTransaction}
            disabled={!sendable || !transactionToSubmit}
            message={"Sign as sender"}
          />

          <Button
            color={"blue"}
            onClick={onSecondarySignerSignTransaction}
            disabled={!sendable || !senderAuthenticator}
            message={"Sign as secondary signer"}
          />
          <Button
            color={"blue"}
            onClick={onSubmitTransaction}
            disabled={!sendable || !secondarySignerAuthenticator}
            message={"Submit transaction"}
          />
        </Col>
      </Row>
      {secondarySignerAccount && secondarySignerAuthenticator && (
        <Row>
          <Col title={true}>
            <h3>Secondary Signer details</h3>
          </Col>
          <Col>
            <p>Private Key: {secondarySignerAccount.privateKey.toString()}</p>
            <p>Public Key: {secondarySignerAccount.publicKey.toString()}</p>
            <p>Address: {secondarySignerAccount.accountAddress.toString()}</p>
          </Col>
        </Row>
      )}
    </>
  );
}
