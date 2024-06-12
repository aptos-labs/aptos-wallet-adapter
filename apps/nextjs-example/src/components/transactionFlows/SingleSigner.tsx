import { isSendableNetwork, aptosClient } from "@/utils";
import { parseTypeTag, AccountAddress, U64 } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

export function SingleSigner() {
  const { toast } = useToast();
  const {
    connected,
    account,
    network,
    signAndSubmitTransaction,
    signMessageAndVerify,
    signMessage,
    signTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const onSignMessageAndVerify = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: Math.random().toString(16),
    };
    const response = await signMessageAndVerify(payload);
    toast({
      title: "Success",
      description: JSON.stringify({ onSignMessageAndVerify: response }),
    });
  };

  const onSignMessage = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: Math.random().toString(16),
    };
    const response = await signMessage(payload);
    toast({
      title: "Success",
      description: JSON.stringify({ onSignMessage: response }),
    });
  };

  const onSignAndSubmitTransaction = async () => {
    if (!account) return;
    const transaction: InputTransactionData = {
      data: {
        function: "0x1::coin::transfer",
        typeArguments: [APTOS_COIN],
        functionArguments: [account.address, 1], // 1 is in Octas
      },
    };
    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptosClient(network).waitForTransaction({
        transactionHash: response.hash,
      });
      toast({
        title: "Success",
        description: <TransactionHash hash={response.hash} network={network} />,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onSignAndSubmitBCSTransaction = async () => {
    if (!account) return;

    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [parseTypeTag(APTOS_COIN)],
          functionArguments: [AccountAddress.from(account.address), new U64(1)], // 1 is in Octas
        },
      });
      await aptosClient(network).waitForTransaction({
        transactionHash: response.hash,
      });
      toast({
        title: "Success",
        description: <TransactionHash hash={response.hash} network={network} />,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Legacy typescript sdk support
  const onSignTransaction = async () => {
    try {
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [account?.address, 1], // 1 is in Octas
      };
      const response = await signTransaction(payload);
      toast({
        title: "Success",
        description: JSON.stringify(response),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onSignTransactionV2 = async () => {
    if (!account) return;

    try {
      const transactionToSign = await aptosClient(
        network,
      ).transaction.build.simple({
        sender: account.address,
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address, 1], // 1 is in Octas
        },
      });
      const response = await signTransaction(transactionToSign);
      toast({
        title: "Success",
        description: JSON.stringify(response),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Signer Flow</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button onClick={onSignAndSubmitTransaction} disabled={!sendable}>
          Sign and submit transaction
        </Button>
        <Button onClick={onSignAndSubmitBCSTransaction} disabled={!sendable}>
          Sign and submit BCS transaction
        </Button>
        <Button onClick={onSignTransaction} disabled={!sendable}>
          Sign transaction
        </Button>
        <Button onClick={onSignTransactionV2} disabled={!sendable}>
          Sign transaction V2
        </Button>
        <Button onClick={onSignMessage} disabled={!sendable}>
          Sign message
        </Button>
        <Button onClick={onSignMessageAndVerify} disabled={!sendable}>
          Sign message and verify
        </Button>
      </CardContent>
    </Card>
  );
}
