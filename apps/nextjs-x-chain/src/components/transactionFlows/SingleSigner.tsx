import { isSendableNetwork, aptosClient } from "@/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

/**
 * Generate a nonce with alphanumeric characters only.
 * This is a requirement for Sign in With Solana nonces
 */
function generateNonce() {
  return crypto.randomUUID().replaceAll("-", "");
}

export function SingleSigner() {
  const { toast } = useToast();
  const {
    connected,
    account,
    network,
    signMessageAndVerify,
    signMessage,
    signTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const onSignMessageAndVerify = async () => {
    if (!account) return;
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: generateNonce(),
    };
    const response = await signMessageAndVerify(payload);
    console.log("sign message and verify response", response);
    toast({
      title: "Success",
      description: JSON.stringify({ onSignMessageAndVerify: response }),
    });
  };

  const onSignMessage = async () => {
    if (!account) return;
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: generateNonce(),
    };
    const response = await signMessage(payload);
    console.log("sign message response", response);
    toast({
      title: "Success",
      description: JSON.stringify({ onSignMessage: response }),
    });
  };

  const onSignTransaction = async () => {
    try {
      if (!account) return;
      const rawTransaction = await aptosClient(
        network
      ).transaction.build.simple({
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address.toString(), 1],
        },
        sender: account.address,
        withFeePayer: true,
      });
      const response = await signTransaction({
        transactionOrPayload: rawTransaction,
      });
      console.log("sign transaction response", response);
      toast({
        title: "Success",
        description: JSON.stringify(response),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onSignRawTransaction = async () => {
    if (!account) return;

    try {
      const rawTransaction = await aptosClient(
        network
      ).transaction.build.simple({
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address.toString(), 1],
        },
        sender: account.address,
        withFeePayer: true,
      });
      const response = await signTransaction({
        transactionOrPayload: rawTransaction,
      });
      console.log("sign raw transaction response", response);
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
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button onClick={onSignTransaction} disabled={!sendable}>
          Sign transaction
        </Button>
        <Button onClick={onSignRawTransaction} disabled={!sendable}>
          Sign raw transaction
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
