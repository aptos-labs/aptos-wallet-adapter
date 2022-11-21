import { AptosClient, Types } from "aptos";
import { useWallet, WalletName, Wallet } from "@aptos/wallet-adapter-react/src";
import { useState } from "react";

export const DEVNET_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";

const aptosClient = new AptosClient(DEVNET_NODE_URL, {
  WITH_CREDENTIALS: false,
});

type Props = {
  wallets: Wallet[];
};

export default function App({ wallets }: Props) {
  const {
    connect,
    disconnect,
    account,
    network,
    getWallet,
    signAndSubmitTransaction,
    signTransaction,
    signMessage,
  } = useWallet();
  const [txsLink, setTxsLink] = useState<string>("");
  const [messageResponse, setMessageResponse] = useState();

  const onConnectClick = (wallet: WalletName) => {
    connect(wallet);
  };

  const onSignAndSubmitTransaction = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [account?.address, 1], // 1 is in Octas
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      await aptosClient.waitForTransaction(response?.hash || "");
      setTxsLink(`https://explorer.devnet.aptos.dev/txn/${response?.hash}`);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const onSignTransaction = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [account?.address, 1], // 1 is in Octas
    };
    try {
      const response = await signTransaction(payload);
      console.log("response", response);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const onSignMessage = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: "random_string",
    };
    try {
      const response = await signMessage(payload);
      setMessageResponse(response as any);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <div>
        {wallets.map((wallet) => {
          return (
            <button
              disabled={wallet.readyState !== "Installed"}
              key={wallet.name}
              onClick={() => onConnectClick(wallet.name)}
            >
              {wallet.name}
            </button>
          );
        })}
      </div>
      <div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
      <div>
        <button onClick={onSignAndSubmitTransaction}>
          Sign and submit transaction
        </button>
        {txsLink.length > 0 && (
          <p>
            <a href={txsLink} target="_blank">
              {txsLink}
            </a>
          </p>
        )}
      </div>
      <div>
        <button onClick={onSignTransaction}>Sign transaction</button>
      </div>

      <div>
        <button onClick={onSignMessage}>Sign Message</button>
        {messageResponse && <p>{JSON.stringify(messageResponse)}</p>}
      </div>

      <div>
        Wallet Name: <div>{JSON.stringify(getWallet()?.name)}</div>
      </div>
      <div>
        Account: <div>{JSON.stringify(account)}</div>
      </div>
      <div>
        Network: <div>{JSON.stringify(network)}</div>
      </div>
    </div>
  );
}
