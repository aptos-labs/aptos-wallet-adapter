import {
  Ed25519PrivateKey,
  PrivateKey,
  PrivateKeyVariants,
  Account,
} from "@aptos-labs/ts-sdk";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

import { isSendableNetwork, aptosClient } from "@/utils";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";

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
    try {
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
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `${error}`,
      });
    }
  };

  const onSignMessage = async () => {
    if (!account) return;
    try {
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
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `${error}`,
      });
    }
  };

  const onSignTransaction = async () => {
    try {
      if (!account) return;
      const payload: InputTransactionData = {
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [account.address.toString(), 1],
        },
        withFeePayer: true,
      };
      const response = await signTransaction({
        transactionOrPayload: payload,
      });
      console.log("sign transaction response", response);
      toast({
        title: "Success",
        description: JSON.stringify(response),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `${error}`,
      });
    }
  };

  const onSignAndSubmitTransaction = async () => {
    if (!account) return;

    try {
      const rawTransaction = await aptosClient(
        network
      ).transaction.build.simple({
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [account.address.toString(), 1],
        },
        sender: account.address,
        withFeePayer: true,
      });
      const response = await signTransaction({
        transactionOrPayload: rawTransaction,
      });

      const privateKey = new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(
          process.env
            .NEXT_PUBLIC_SWAP_CCTP_SPONSOR_ACCOUNT_PRIVATE_KEY as string,
          PrivateKeyVariants.Ed25519
        )
      );
      const sponsor = Account.fromPrivateKey({ privateKey });

      const aponsorAuth = aptosClient(network).transaction.signAsFeePayer({
        signer: sponsor,
        transaction: rawTransaction,
      });

      const txnSubmitted = await aptosClient(network).transaction.submit.simple(
        {
          transaction: rawTransaction,
          senderAuthenticator: response.authenticator,
          feePayerAuthenticator: aponsorAuth,
        }
      );

      await aptosClient(network).waitForTransaction({
        transactionHash: txnSubmitted.hash,
      });

      toast({
        title: "Success",
        description: (
          <TransactionHash hash={txnSubmitted.hash} network={network} />
        ),
      });
    } catch (error) {
      console.log(`Error signing and submitting transaction: ${error}`);
      toast({
        title: "Error",
        description: `${error}`,
      });
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
        <Button onClick={onSignMessage} disabled={!sendable}>
          Sign message
        </Button>
        <Button onClick={onSignMessageAndVerify} disabled={!sendable}>
          Sign message and verify
        </Button>
        <Button onClick={onSignAndSubmitTransaction} disabled={!sendable}>
          Sign and submit transaction
        </Button>
      </CardContent>
    </Card>
  );
}
