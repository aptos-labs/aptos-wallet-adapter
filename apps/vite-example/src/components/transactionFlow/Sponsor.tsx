import {
  AccountAddress,
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
  const [feepayerAddress, setFeepayerAddress] = useState<AccountAddress>();

  let sendable = isSendableNetwork(connected, network?.name);

  // Generate a raw transaction using the SDK
  const generateTransaction = async (): Promise<AnyRawTransaction> => {
    if (!account) {
      throw new Error("no account");
    }
    const transactionToSign = await aptosClient(
      network?.name.toLowerCase()
    ).transaction.build.simple({
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

  const onSignTransaction = async () => {
    const transaction = await generateTransaction();
    setTransactionToSubmit(transaction);

    try {
      const authenticator = await signTransaction(transaction);
      setSenderAuthenticator(authenticator);
    } catch (error) {
      console.error(error);
    }
  };

  const onSignTransactionAsSponsor = async () => {
    if (!transactionToSubmit) {
      throw new Error("No Transaction to sign");
    }
    try {
      const authenticator = await signTransaction(transactionToSubmit, true);
      setFeepayerAuthenticator(authenticator);
      setFeepayerAddress(AccountAddress.from(account!.address));
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
    transactionToSubmit.feePayerAddress = feepayerAddress;
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
          onClick={() => onSignTransaction()}
          disabled={!sendable}
          message={"Sign as Sender"}
        />
        <Button
          color={"blue"}
          onClick={() => onSignTransactionAsSponsor()}
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
