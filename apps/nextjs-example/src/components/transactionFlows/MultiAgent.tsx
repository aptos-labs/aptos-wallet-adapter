import { aptosClient, isSendableNetwork } from "@/utils";
import {
  Account,
  AccountAuthenticator,
  AnyRawTransaction,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { TransactionHash } from "../TransactionHash";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { LabelValueGrid } from "../LabelValueGrid";

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

export function MultiAgent() {
  const { toast } = useToast();
  const { connected, account, network, signTransaction, submitTransaction } =
    useWallet();

  const [secondarySignerAccount, setSecondarySignerAccount] =
    useState<Ed25519Account>();
  const [transactionToSubmit, setTransactionToSubmit] =
    useState<AnyRawTransaction | null>(null);

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
    // TODO: support custom network
    await aptosClient(network).fundAccount({
      accountAddress: secondarySigner.accountAddress.toString(),
      amount: 100_000_000,
    });
    setSecondarySignerAccount(secondarySigner);

    const transactionToSign = await aptosClient(
      network,
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
        <CardTitle>Multi Agent Transaction Flow</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-4">
          <Button onClick={onSenderSignTransaction} disabled={!sendable}>
            Sign as sender
          </Button>
          <Button
            onClick={onSecondarySignerSignTransaction}
            disabled={!sendable || !senderAuthenticator}
          >
            Sign as secondary signer
          </Button>
          <Button
            onClick={onSubmitTransaction}
            disabled={!sendable || !secondarySignerAuthenticator}
          >
            Submit transaction
          </Button>
        </div>

        {secondarySignerAccount && senderAuthenticator && (
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-medium">Secondary Signer details</h4>
            <LabelValueGrid
              items={[
                {
                  label: "Private Key",
                  value: secondarySignerAccount.privateKey.toString(),
                },
                {
                  label: "Public Key",
                  value: secondarySignerAccount.publicKey.toString(),
                },
                {
                  label: "Address",
                  value: secondarySignerAccount.accountAddress.toString(),
                },
              ]}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
