import { isSendableNetwork, aptosClient } from "@/utils";
import { parseTypeTag, AccountAddress, U64 } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";

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
    wallet,
    connected,
    account,
    network,
    signAndSubmitTransaction,
    signMessageAndVerify,
    signMessage,
    signTransaction,
    signIn,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const onSignIn = async () => {
    if (!wallet) {
      return toast({
        title: "Error",
        description: "Wallet not connected",
      });
    }

    const response = await signIn({
      walletName: wallet.name,
      input: {
        domain: "localhost:3000",
        nonce: Math.random().toString(16),
        statement: "Signing into demo application",
        notBefore: new Date().toISOString(),
        expirationTime: new Date(
          Date.now() + 1000 * 60 * 60 * 24
        ).toISOString(),
        issuedAt: new Date().toISOString(),
        requestId: "abc",
        resources: ["resource.1", "resource.2"],
      },
    });

    console.log(response);
    toast({ title: "Success", description: "Check console for response" });
  };

  const onSignInError = async () => {
    if (!wallet) {
      return toast({ title: "Error", description: "Wallet not connected" });
    }

    await signIn({
      walletName: wallet.name,
      input: {
        nonce: Math.random().toString(16),
        statement: "Signing into demo application",
        notBefore: new Date().toISOString(),
        expirationTime: new Date(
          Date.now() + 1000 * 60 * 60 * 24
        ).toISOString(),
        issuedAt: new Date().toISOString(),
        requestId: "abc",
        resources: ["resource.1", "resource.2"],
        address: "0x1",
        chainId: "1",
        domain: "example.com",
        uri: "http://example.com",
        version: "3",
      } as any,
    });
  };

  const onSignMessageAndVerify = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: generateNonce(),
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
      nonce: generateNonce(),
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
      const response = await signAndSubmitTransaction({
        ...transaction,
        pluginParams: {
          customParam: "customValue",
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

  const onSignAndSubmitScriptTransaction = async () => {
    if (!account) return;
    const transaction: InputTransactionData = {
      data: {
        bytecode:
          "0xa11ceb0b0700000a06010002030206050806070e2508334010731f010200030001000103060c050300083c53454c463e5f30046d61696e0d6170746f735f6163636f756e74087472616e73666572ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000114636f6d70696c6174696f6e5f6d65746164617461090003322e3003322e31000001050b000b010b02110002",
        typeArguments: [],
        functionArguments: [account.address, new U64(1)], // 1 is in Octas
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
      const payload: InputTransactionData = {
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account?.address, 1],
        },
      };
      const response = await signTransaction({
        transactionOrPayload: payload,
      });
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
      const transactionToSign = await aptosClient(
        network
      ).transaction.build.simple({
        sender: account.address,
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address, 1],
        },
      });
      const response = await signTransaction({
        transactionOrPayload: transactionToSign,
      });
      toast({
        title: "Success",
        description: JSON.stringify(response),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onAddAuthenticationFunction = async () => {
    if (!account) return;
    alert("This method tests the wallet displays a warning message.");
    const transaction: InputTransactionData = {
      data: {
        function: "0x1::account_abstraction::add_authentication_function",
        functionArguments: [account.address, "dummyModule", "dummyFunction"],
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Single Signer Flow</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={onSignAndSubmitTransaction} disabled={!sendable}>
            Sign and submit transaction
          </Button>
          <Button
            onClick={onSignAndSubmitScriptTransaction}
            disabled={!sendable}
          >
            Sign and submit script transaction
          </Button>
          <Button onClick={onSignAndSubmitBCSTransaction} disabled={!sendable}>
            Sign and submit BCS transaction
          </Button>
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
          <Button onClick={onSignIn} disabled={!sendable}>
            Sign in
          </Button>
          <Button onClick={onSignInError} disabled={!sendable}>
            Sign in Error
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account Abstraction</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button
            onClick={onAddAuthenticationFunction}
            disabled={!sendable}
            variant="secondary"
          >
            Add authentication function
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
