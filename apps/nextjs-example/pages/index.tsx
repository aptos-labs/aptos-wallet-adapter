import { AptosClient, Types } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import WalletConnector from "../../../packages/wallet-adapter-mui-design/src/WalletConnector";
import { useState } from "react";
import { ErrorAlert, SuccessAlert } from "../components/Alert";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useAutoConnect } from "../components/AutoConnectProvider";

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
    signMessageAndVerify,
  } = useWallet();

  const { autoConnect, setAutoConnect } = useAutoConnect();
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
        `https://explorer.aptoslabs.com/txn/${response?.hash}`
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
      setSuccessAlertMessage(JSON.stringify(response));
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

  const onSignMessageAndVerify = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: "random_string",
    };
    try {
      const response = await signMessageAndVerify(payload);
      setSuccessAlertMessage(
        JSON.stringify({ onSignMessageAndVerify: response })
      );
      console.log("response", response);
    } catch (error: any) {
      console.log("error", error);
      setErrorAlertMessage(JSON.stringify({ onSignMessageAndVerify: error }));
    }
  };

  return (
    <div>
      {successAlertMessage.length > 0 && (
        <SuccessAlert text={successAlertMessage} />
      )}
      {errorAlertMessage.length > 0 && <ErrorAlert text={errorAlertMessage} />}
      <h1 className="flex justify-center mt-2 mb-4 text-4xl font-extrabold tracking-tight leading-none text-black">
        Aptos Wallet Adapter Demo (Devnet)
      </h1>
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
            <td className="px-8 border-t py-4 w-1/4">
              <h3>Wallet Selector</h3>
            </td>
          </tr>
          <tr>
            <th>Ant Design</th>
            <td className="px-8">
              <WalletSelector />
            </td>
          </tr>
          <tr>
            <th>MUI Design</th>
            <td className="px-8">
              <WalletConnector />
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

                <button
                  className={`bg-orange-500 text-white font-bold py-2 px-4 rounded mr-4 ${
                    !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-orange-700"
                  }`}
                  onClick={onSignMessageAndVerify}
                  disabled={!connected}
                >
                  Sign Message and Verify
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

          <tr>
            <td className="px-8 py-4 border-t">
              <h3>auto connect</h3>
            </td>
            <td className="px-8 py-4 border-t">
              <div className="relative flex flex-col overflow-hidden">
                <div className="flex">
                  <label className="inline-flex relative items-center mr-5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={autoConnect}
                      readOnly
                    />
                    <div
                      onClick={() => {
                        setAutoConnect(!autoConnect);
                      }}
                      className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                    ></div>
                  </label>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
