import { AptosClient, Types } from "aptos";
import { useWallet } from "@aptos/wallet-adapter-react";
import { useState } from "react";
import { ErrorAlert, SuccessAlert } from "../components/Alert";
import dynamic from "next/dynamic";
import Image from "next/image";

const WalletButtons = dynamic(() => import("../components/WalletButtons"), {
  suspense: false,
  ssr: false,
});

export const DEVNET_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";

const aptosClient = new AptosClient(DEVNET_NODE_URL, {
  WITH_CREDENTIALS: false,
});

export default function App() {
  const {
    connected,
    disconnect,
    account,
    network,
    wallet,
    signAndSubmitTransaction,
    signTransaction,
    signMessage,
  } = useWallet();

  const [successAlertMessage, setSuccessAlertMessage] = useState<string>("");
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>("");

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
      setSuccessAlertMessage(
        `https://explorer.devnet.aptos.dev/txn/${response?.hash}`
      );
    } catch (error: any) {
      console.log("error", error);
      setErrorAlertMessage(error);
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
      setErrorAlertMessage(error);
    }
  };

  const onSignMessage = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: "random_string",
    };
    try {
      const response = await signMessage(payload);
      setSuccessAlertMessage(JSON.stringify(response));
      console.log("response", response);
    } catch (error: any) {
      console.log("error", error);
      setErrorAlertMessage(error);
    }
  };

  return (
    <div>
      {successAlertMessage.length > 0 && (
        <SuccessAlert text={successAlertMessage} />
      )}
      {errorAlertMessage.length > 0 && <ErrorAlert text={errorAlertMessage} />}
      <table className="table-auto w-full border-separate border-spacing-y-8 shadow-lg bg-white border-separate">
        <tbody>
          <tr>
            <td className="px-8 py-4 w-1/4">
              <h3>Connect a Wallet</h3>
            </td>
            <td className="px-8 py-4 w-3/4">
              <WalletButtons />
            </td>
          </tr>
          <tr>
            <td className="px-8 py-4 border-t w-1/4">
              <h3>Actions</h3>
            </td>
            <td className="px-8 py-4 border-t break-all w-3/4">
              <div>
                <button
                  className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${
                    !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={disconnect}
                  disabled={!connected}
                >
                  Disconnect
                </button>
                <button
                  className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${
                    !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={onSignAndSubmitTransaction}
                  disabled={!connected}
                >
                  Sign and submit transaction
                </button>
                <button
                  className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${
                    !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={onSignTransaction}
                  disabled={!connected}
                >
                  Sign transaction
                </button>
                <button
                  className={`bg-blue-500 text-white font-bold py-2 px-4 rounded mr-4 ${
                    !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={onSignMessage}
                  disabled={!connected}
                >
                  Sign Message
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td className="px-8 py-4 border-t w-1/4">
              <h3>Wallet Name</h3>
            </td>
            <td className="px-8 py-4 border-t w-3/4">
              <div style={{ display: "flex" }}>
                {wallet && (
                  <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    width={25}
                    height={25}
                  />
                )}
                {wallet?.name}
              </div>
              <div>
                <a
                  target="_blank"
                  className="text-sky-600"
                  rel="noreferrer"
                  href={wallet?.url}
                >
                  {wallet?.url}
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td className="px-8 py-4 border-t">
              <h3>Account</h3>
            </td>
            <td className="px-8 py-4 border-t break-all">
              <div>{account ? JSON.stringify(account) : ""}</div>
            </td>
          </tr>
          <tr>
            <td className="px-8 py-4 border-t">
              <h3>Network</h3>
            </td>
            <td className="px-8 py-4 border-t">
              <div>{network ? JSON.stringify(network) : ""}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
