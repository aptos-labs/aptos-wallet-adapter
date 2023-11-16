import { AccountAuthenticator, AnyRawTransaction } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";
import { aptosClient } from "../../utils";
import { useAlert } from "../AlertProvider";
import Button from "../Button";
import Col from "../Col";
import Row from "../Row";
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
type SponsorTransactionProps = {
  isSendableNetwork: (connected: boolean, network?: string) => boolean;
};

export default function SponsorTransaction({
  isSendableNetwork,
}: SponsorTransactionProps) {
  const { connected, account, network, signTransaction, submitTransaction } =
    useWallet();
  const [transactionToSubmit, setTransactionToSubmit] =
    useState<AnyRawTransaction | null>(null);
  const { setSuccessAlertHash } = useAlert();

  const [senderAuthenticator, setSenderAuthenticator] =
    useState<AccountAuthenticator>();
  const [feepayerAuthenticator, setFeepayerAuthenticator] =
    useState<AccountAuthenticator>();

  let sendable = isSendableNetwork(connected, network?.name);

  useEffect(() => {
    if (!sendable) return;
    if (!account) return;
    if (!network) return;

    // Generate a raw transaction using the SDK
    const generate = async (): Promise<AnyRawTransaction> => {
      const transactionToSign = await aptosClient(
        network?.name.toLowerCase()
      ).build.transaction({
        sender: account.address,
        withFeePayer: true,
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address, 1], // 1 is in Octas
        },
      });
      return transactionToSign;
    };

    // Fund current connected account to create it on chain
    const fundCurrentAccount = async () => {
      await aptosClient(network.name.toLowerCase()).fundAccount({
        accountAddress: account.address,
        amount: 100_000_000,
      });
    };

    // We fund the current connected account to create it on chain
    // Then we generate the transaction with the current connected account
    // as the sender
    fundCurrentAccount().then(() => {
      generate().then((transactionToSign) =>
        setTransactionToSubmit(transactionToSign)
      );
    });
  }, [network, account, sendable]);

  const onSignTransaction = async (asSponsor?: boolean) => {
    if (!transactionToSubmit) {
      throw new Error("No Transaction to sign");
    }
    try {
      const authenticator = await signTransaction(
        transactionToSubmit,
        asSponsor
      );
      if (asSponsor) {
        setFeepayerAuthenticator(authenticator);
      } else {
        setSenderAuthenticator(authenticator);
      }
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
    if (!feepayerAuthenticator) {
      throw new Error("No feepayerAuthenticator");
    }
    try {
      const response = await submitTransaction({
        transaction: transactionToSubmit,
        senderAuthenticator: senderAuthenticator,
        feePayerAuthenticator: feepayerAuthenticator,
      });
      setSuccessAlertHash(response.hash, network?.name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row>
      <Col title={true} border={true}>
        <h3>Sponsor Transaction Flow</h3>
      </Col>
      <Col border={true}>
        <Button
          color={"blue"}
          onClick={() => onSignTransaction(false)}
          disabled={!sendable || !transactionToSubmit}
          message={"Sign as Sender"}
        />
        <Button
          color={"blue"}
          onClick={() => onSignTransaction(true)}
          disabled={!sendable || !senderAuthenticator}
          message={"Sign as Sponsor"}
        />
        <Button
          color={"blue"}
          onClick={onSubmitTransaction}
          disabled={!sendable || !feepayerAuthenticator}
          message={"Submit transaction"}
        />
      </Col>
    </Row>
  );
}
