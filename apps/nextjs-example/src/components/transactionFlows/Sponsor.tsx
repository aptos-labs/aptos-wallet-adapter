import { aptosClient, isSendableNetwork } from "@/utils";
import {
  Account,
  AccountAddress,
  AccountAuthenticator,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { TransactionHash } from "../TransactionHash";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../ui/use-toast";

export function Sponsor() {
  const { toast } = useToast();
  const { connected, account, network, signTransaction, submitTransaction } =
    useWallet();
  const [transactionToSubmit, setTransactionToSubmit] =
    useState<AnyRawTransaction | null>(null);

  const [senderAuthenticator, setSenderAuthenticator] =
    useState<AccountAuthenticator>();
  const [feepayerAuthenticator, setFeepayerAuthenticator] =
    useState<AccountAuthenticator>();

  const [senderAccount, setSenderAccount] =
    useState<Account | null>();

  let sendable = isSendableNetwork(connected, network?.name);

  // Generate a raw transaction using the SDK
  const generateTransaction = async (sender: Account): Promise<AnyRawTransaction> => {
    if (!account) {
      throw new Error("no account");
    }
    const transactionToSign = await aptosClient(
      network
    ).transaction.build.simple({
      sender: sender.accountAddress,
      withFeePayer: true,
      data: {
        function: "0x1::resource_account::create_resource_account",
        typeArguments: [],
        functionArguments: [account.address.toString(), AccountAddress.from("0x0").toUint8Array()],
      },
    });
    transactionToSign.feePayerAddress = account.address;
    return transactionToSign;
  };

  const onSignTransaction = async () => {
    let sender = Account.generate();
    setSenderAccount(sender);

    const transaction = await generateTransaction(sender);
    setTransactionToSubmit(transaction);

    try {
      const authenticator = aptosClient(
        network
      ).transaction.sign({
        signer: sender,
        transaction: transaction,
      });
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
      const response = await signTransaction({
        transactionOrPayload: transactionToSubmit,
        asFeePayer: true,
      });
      setFeepayerAuthenticator(response.authenticator);
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
      toast({
        title: "Success",
        description: <TransactionHash hash={response.hash} network={network} />,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sponsor Transaction Flow</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button onClick={onSignTransaction} disabled={!sendable}>
          Sign as sender
        </Button>
        <Button
          onClick={onSignTransactionAsSponsor}
          disabled={!sendable || !senderAuthenticator}
        >
          Sign as sponsor
        </Button>
        <Button
          onClick={onSubmitTransaction}
          disabled={!sendable || !senderAuthenticator}
        >
          Submit transaction
        </Button>
      </CardContent>
    </Card>
  );
}
