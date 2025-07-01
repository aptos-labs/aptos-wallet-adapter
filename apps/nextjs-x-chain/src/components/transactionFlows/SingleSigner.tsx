import { getAptBalanceQueryOptions } from "@/utils/getAptBalanceQueryOptions";
import {
  Account,
  AccountAuthenticator,
  Ed25519PrivateKey,
  InputGenerateTransactionPayloadData,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

import { isSendableNetwork, aptosClient } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";
import { useUSDCBalance } from "@/contexts/USDCBalanceContext";

/**
 * Generate a nonce with alphanumeric characters only.
 * This is a requirement for Sign in With Solana nonces
 */
function generateNonce() {
  return crypto.randomUUID().replaceAll("-", "");
}

export type SingleSignerProps = {
  dappNetwork: Network;
};

export function SingleSigner({ dappNetwork }: SingleSignerProps) {
  const { toast } = useToast();
  const {
    connected,
    account,
    network,
    signMessageAndVerify,
    signMessage,
    signTransaction,
  } = useWallet();
  const { globalTransactionInProgress, setGlobalTransactionInProgress } =
    useUSDCBalance();

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

  const aptBalance = useQuery({
    enabled: account !== undefined && network !== undefined,
    ...getAptBalanceQueryOptions({
      accountAddress: account!.address,
      network: network!.name,
    }),
  });

  const onSignAndSubmitTransaction = async () => {
    if (!account) return;

    let transactionData: InputGenerateTransactionPayloadData;

    // On testnet, derived account can't just fund their account with APT on the UI (but need to go to the faucet to get APT),
    // we will post a message to the message board as an example.
    // We can guarantee that the message board is deployed on Testnet as it is not getting wiped (like devnet).
    if (dappNetwork === Network.TESTNET) {
      transactionData = {
        function:
          "0xeadc81e5ac02adc11308f643761294e27103a4a36822761633fd40cb08f59ed9::message_board::post_message",
        functionArguments: ["Hello from Aptos Wallet Adapter"],
      };
    } else {
      // We are on Devnet, so just use a simple transfer transaction as the derived account can fund their own account with APT.
      transactionData = {
        function: "0x1::aptos_account::transfer",
        functionArguments: [account.address.toString(), 717],
      };
    }

    setGlobalTransactionInProgress(true);
    try {
      const rawTransaction = await aptosClient(
        network
      ).transaction.build.simple({
        data: transactionData,
        options: {
          maxGasAmount: 2000,
        },
        sender: account.address,
        withFeePayer: dappNetwork === Network.TESTNET ? true : false,
      });

      const response = await signTransaction({
        transactionOrPayload: rawTransaction,
      });

      let sponsorAuthenticator: AccountAuthenticator | undefined;
      if (dappNetwork === Network.TESTNET) {
        const sponsorPrivateKey = new Ed25519PrivateKey(
          PrivateKey.formatPrivateKey(
            process.env
              .NEXT_PUBLIC_SWAP_CCTP_SPONSOR_ACCOUNT_PRIVATE_KEY as string,
            PrivateKeyVariants.Ed25519
          )
        );
        const sponsor = Account.fromPrivateKey({
          privateKey: sponsorPrivateKey,
        });
        sponsorAuthenticator = aptosClient(network).transaction.signAsFeePayer({
          signer: sponsor,
          transaction: rawTransaction,
        });
      }

      const txnSubmitted = await aptosClient(network).transaction.submit.simple(
        {
          transaction: rawTransaction,
          senderAuthenticator: response.authenticator,
          feePayerAuthenticator: sponsorAuthenticator,
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

      void aptBalance.refetch();
    } catch (error) {
      console.log(`Error signing and submitting transaction: ${error}`);
      toast({
        title: "Error",
        description: `${error}`,
      });
    } finally {
      setGlobalTransactionInProgress(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button
          onClick={onSignTransaction}
          disabled={!sendable || globalTransactionInProgress}
        >
          Sign transaction
        </Button>
        <Button
          onClick={onSignMessage}
          disabled={!sendable || globalTransactionInProgress}
        >
          Sign message
        </Button>
        <Button
          onClick={onSignMessageAndVerify}
          disabled={!sendable || globalTransactionInProgress}
        >
          Sign message and verify
        </Button>
        <Button
          onClick={onSignAndSubmitTransaction}
          disabled={!sendable || globalTransactionInProgress}
        >
          Sign and submit transaction
        </Button>
      </CardContent>
    </Card>
  );
}
