import { aptosClient, isSendableNetwork } from "@/utils";
import {
  Account,
  AccountAddress,
  AccountAuthenticator,
  AnyRawTransaction,
  Ed25519Account,
  parseTypeTag,
  U64,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { TransactionHash } from "../TransactionHash";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { LabelValueGrid } from "../LabelValueGrid";

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
/*
script {
    fun main(signer_1: &signer, _signer_2: &signer, to: address, amount: u64){
        aptos_framework::aptos_account::transfer(signer_1,to,amount);
    }
}
*/
const TRANSFER_SCRIPT = "0xa11ceb0b0700000a0601000203020605080d071525083a40107a1f010200030201000104060c060c05030003060c0503083c53454c463e5f30046d61696e0d6170746f735f6163636f756e74087472616e73666572ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000114636f6d70696c6174696f6e5f6d65746164617461090003322e3003322e31000001070b000b01010b020b03110002"
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
    setSecondarySignerAccount(secondarySigner);

    const transactionToSign = await aptosClient(
      network
    ).transaction.build.multiAgent({
      sender: account.address,
      secondarySignerAddresses: [secondarySigner.accountAddress],
      data: {
        bytecode: TRANSFER_SCRIPT,
        typeArguments: [],
        functionArguments: [account.address, new U64(1)],
      },
    });
    return transactionToSign;
  };

  const onSenderSignTransaction = async () => {
    const transaction = await generateTransaction();
    setTransactionToSubmit(transaction);
    try {
      const response = await signTransaction({
        transactionOrPayload: transaction,
      });
      setSenderAuthenticator(response.authenticator);
    } catch (error) {
      console.error(error);
    }
  };

  const onSecondarySignerSignTransaction = async () => {
    if (!transactionToSubmit) {
      throw new Error("No Transaction to sign");
    }
    if (!secondarySignerAccount) {
      throw new Error("No secondarySignerAccount");
    }
    try {
      if(!secondarySignerAccount) {
        throw new Error("No secondarySignerAccount");
      }
      const authenticator = aptosClient(network).sign({signer: secondarySignerAccount, transaction: transactionToSubmit});
      setSecondarySignerAuthenticator(authenticator);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitTransaction = async () => {
    try {
      if (!transactionToSubmit) {
        throw new Error("No Transaction to sign");
      }
      if (!senderAuthenticator) {
        throw new Error("No senderAuthenticator");
      }
      if (!secondarySignerAuthenticator) {
        throw new Error("No secondarySignerAuthenticator");
      }
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to submit multiagent Transaction.",
      });
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
