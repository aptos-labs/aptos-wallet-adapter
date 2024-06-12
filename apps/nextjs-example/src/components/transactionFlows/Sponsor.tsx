import { aptosClient, isSendableNetwork } from "@/utils";
import {
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

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

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
  const [feepayerAddress, setFeepayerAddress] = useState<AccountAddress>();

  let sendable = isSendableNetwork(connected, network?.name);

  // Generate a raw transaction using the SDK
  const generateTransaction = async (): Promise<AnyRawTransaction> => {
    if (!account) {
      throw new Error("no account");
    }
    const transactionToSign = await aptosClient(
      network,
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
          onClick={onSignTransaction}
          disabled={!sendable || !senderAuthenticator}
        >
          Submit transaction
        </Button>
      </CardContent>
    </Card>
  );
}
