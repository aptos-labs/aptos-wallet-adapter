import {
  Account,
  AccountAuthenticator,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import { useState } from "react";
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

  const generateTransaction = async (): Promise<AnyRawTransaction> => {
    if (!account) {
      throw new Error("no account");
    }
    if (!network) {
      throw new Error("no network");
    }

    const secondarySigner = Account.generate();
    await aptosClient(network.name.toLowerCase()).fundAccount({
      accountAddress: secondarySigner.accountAddress.toString(),
      amount: 100_000_000,
    });
    setSecondarySignerAccount(secondarySigner);

    const transactionToSign = await aptosClient(
      network?.name.toLowerCase()
    ).transaction.build.multiAgent({
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

  const onSenderSignTransaction = async () => {
    const transaction = await generateTransaction();
    setTransactionToSubmit(transaction);
    try {
      const authenticator = await signTransaction(transaction);
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
            disabled={!sendable}
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
      {secondarySignerAccount && senderAuthenticator && (
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
