import {AptosClient, BCS, TxnBuilderTypes, Types} from "aptos";
import {NetworkName, useWallet} from "@aptos-labs/wallet-adapter-react";
import {WalletConnector} from "@aptos-labs/wallet-adapter-mui-design";
import dynamic from "next/dynamic";
import Image from "next/image";
import {useAutoConnect} from "../components/AutoConnectProvider";
import {useAlert} from "../components/AlertProvider";
import {AccountInfo, NetworkInfo, WalletInfo} from "@aptos-labs/wallet-adapter-core";

const WalletButtons = dynamic(() => import("../components/WalletButtons"), {
  suspense: false,
  ssr: false,
});

const WalletSelectorAntDesign = dynamic(
  () => import("../components/WalletSelectorAntDesign"),
  {
    suspense: false,
    ssr: false,
  }
);

export const DEVNET_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
export const TESTNET_NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
export const MAINNET_NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";

const aptosClient = (network?: string) => {
    if (network === NetworkName.Devnet.toLowerCase()) {
        return DEVNET_CLIENT;
    } else if (network === NetworkName.Testnet.toLowerCase()) {
        return TESTNET_CLIENT;
    } else if (network === NetworkName.Mainnet.toLowerCase()) {
        return MAINNET_CLIENT;
    } else {
        throw new Error(`Unknown network: ${network}`);
    }
}

const DEVNET_CLIENT = new AptosClient(DEVNET_NODE_URL, {
    WITH_CREDENTIALS: false,
});
const TESTNET_CLIENT = new AptosClient(TESTNET_NODE_URL, {
    WITH_CREDENTIALS: false,
});
const MAINNET_CLIENT = new AptosClient(MAINNET_NODE_URL, {
    WITH_CREDENTIALS: false,
});

const isGood =(good: boolean) => {
    if (good) {
        return { color: 'green'}
    } else {
        return {color: 'black', border: '2px solid red'}
    }
}

export default function App() {
  const {
    account,
      connected,
    network,
    wallet,
  } = useWallet();

  return (
    <div>
      <h1 className="flex justify-center mt-2 mb-4 text-4xl font-extrabold tracking-tight leading-none text-black">
        Aptos Wallet Adapter Tester ({network?.name ?? ""})
      </h1>
      <table className="table-auto w-full border-separate border-spacing-y-8 shadow-lg bg-white border-separate">
        <tbody>
          <WalletSelect/>
          <AutoConnect/>
          {connected && <WalletProps wallet={wallet} network={network} account={account}/>}
          {connected && <RequiredFunctionality/>}
          {connected && <OptionalFunctionality/>}
        </tbody>
      </table>
    </div>
  );
}

function WalletSelect() {
  return <>
      <tr>
          <td className="px-8 py-4 border-t w-1/4">
              <h2><b>Wallet Select</b></h2>
          </td>
          <td className="px-8 py-4 border-t w-3/4"></td>
      </tr>
      <tr>
          <td className="px-8 py-4 w-1/4">
              <h3>Connect a Wallet</h3>
          </td>
          <td className="px-8 py-4 w-3/4">
              <WalletButtons/>
          </td>
      </tr>
      <tr>
          <td className="px-8 py-4 w-1/4">
              <h3>Ant Design</h3>
          </td>
          <td className="px-8 py-4 w-3/4">
              <WalletSelectorAntDesign/>
          </td>
      </tr>
      <tr>
          <td className="px-8 py-4 w-1/4">
              <h3>MUI Design</h3>
          </td>
          <td className="px-8 py-4 w-3/4">
              <WalletConnector/>
          </td>
      </tr>
  </>;
}

function WalletProps(props: {account: AccountInfo | null, network: NetworkInfo | null, wallet: WalletInfo | null}) {

    const isValidNetworkName = () => {
        return Object.values<string | undefined>(NetworkName).includes(props.network?.name);
    }

    return <>
        <tr>
            <td className="px-8 py-4 border-t w-1/4">
                <h3>Wallet Name</h3>
            </td>
            <td className="px-8 py-4 border-t w-3/4">
                <div>
                    <b>Icon: </b>
                    {props.wallet && (
                        <Image
                            src={props.wallet.icon}
                            alt={props.wallet.name}
                            width={25}
                            height={25}
                        />
                    )}
                </div>
                <div>
                    <b>Name: </b>
                    {props.wallet?.name}
                </div>
                <div>
                    <b>URL: </b>
                    <a
                        target="_blank"
                        className="text-sky-600"
                        rel="noreferrer"
                        href={props.wallet?.url}
                    >
                        {props.wallet?.url}
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td className="px-8 py-4 border-t">
                <h3>Account Info</h3>
            </td>
            <td className="px-8 py-4 border-t break-all">
                <DisplayRequiredValue name={"Address"} isGood={ !!props.account?.address} value={props.account?.address}/>
                <DisplayRequiredValue name={"Public key"} isGood={!!props.account?.publicKey} value={props.account?.publicKey?.toString()}/>
                <DisplayOptionalValue name={"ANS Name (only if attached)"} value={props.account?.ansName}/>
                <DisplayOptionalValue name={"Min keys required (only for multisig)"} value={props.account?.minKeysRequired?.toString()}/>
            </td>
        </tr>
        <tr>
            <td className="px-8 py-4 border-t">
                <h3>Network Info</h3>
            </td>
            <td className="px-8 py-4 border-t">
                <DisplayRequiredValue name={"Network Name"} isGood={isValidNetworkName()} value={props.network?.name} expected={"one of: " + Object.values<string>(NetworkName).join(", ")}/>
                <DisplayOptionalValue name={"URL"} value={props.network?.url} />
                <DisplayOptionalValue name={"ChainId"} value={props.network?.chainId} />
            </td>
        </tr>
    </>;
}

function DisplayRequiredValue(props: {name: string, isGood: boolean, value?: string, expected?: string}) {
    return <div style={isGood(props.isGood)}><p><b>{props.name}:</b> {props.value ?? "Not present"} {!props.isGood && props.expected && <><b>Expected:</b> {props.expected}</>}</p></div>
}
function DisplayOptionalValue(props: {name: string, value?: string | null}) {
    return <div><p><b>{props.name}:</b> {props.value ?? "Not present"}</p></div>
}

function AutoConnect() {
    const { autoConnect, setAutoConnect } = useAutoConnect();
    return <>
        <tr>
            <td className="px-8 py-4 border-t">
                <h3>Auto reconnect on page open</h3>
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
    </>;
}

function RequiredFunctionality() {
    const { setSuccessAlertMessage, setSuccessAlertHash } = useAlert();
    // TODO: pass as props
    const {
        connected,
        disconnect,
        account,
        network,
        signAndSubmitTransaction,
        signMessage,
    } = useWallet();

    const onSignMessage = async () => {
        const payload = {
            message: "Hello from Aptos Wallet Adapter",
            nonce: Math.random().toString(16),
            address: true,
            application: true,
            chain_id: true,
        };
        const response = await signMessage(payload);
        setSuccessAlertMessage(JSON.stringify(response));
    };

    const onSignAndSubmitTransaction = async () => {
        const payload: Types.TransactionPayload = {
            type: "entry_function_payload",
            function: "0x1::coin::transfer",
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [account?.address, 1], // 1 is in Octas
        };
        const response = await signAndSubmitTransaction(payload);
        try {
            await aptosClient(network?.name.toLowerCase()).waitForTransaction(response.hash);
            setSuccessAlertHash(response.hash, network?.name);
        } catch (error) {
            console.error(error);
        }
    };

    return <tr>
        <td className="px-8 py-4 border-t w-1/4">
            <h3>Standard functions</h3>
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
    </tr>;
}

function OptionalFunctionality() {
    const { setSuccessAlertMessage, setSuccessAlertHash } = useAlert();
    // TODO: pass as props
    const {
        connected,
        account,
        network,
        signAndSubmitBCSTransaction,
        signTransaction,
        signMessageAndVerify,
    } = useWallet();

    const onSignAndSubmitBCSTransaction = async () => {
        const token = new TxnBuilderTypes.TypeTagStruct(
            TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin")
        );
        const entryFunctionBCSPayload =
            new TxnBuilderTypes.TransactionPayloadEntryFunction(
                TxnBuilderTypes.EntryFunction.natural(
                    "0x1::coin",
                    "transfer",
                    [token],
                    [
                        BCS.bcsToBytes(
                            TxnBuilderTypes.AccountAddress.fromHex(account!.address)
                        ),
                        BCS.bcsSerializeUint64(2),
                    ]
                )
            );

        const response = await signAndSubmitBCSTransaction(entryFunctionBCSPayload);
        try {
            await aptosClient(network?.name.toLowerCase()).waitForTransaction(response.hash);
            setSuccessAlertHash(response.hash, network?.name);
        } catch (error) {
            console.error(error);
        }
    };

    const onSignTransaction = async () => {
        const payload: Types.TransactionPayload = {
            type: "entry_function_payload",
            function: "0x1::coin::transfer",
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [account?.address, 1], // 1 is in Octas
        };
        const response = await signTransaction(payload);
        setSuccessAlertMessage(JSON.stringify(response));
    };

    const onSignMessageAndVerify = async () => {
        const payload = {
            message: "Hello from Aptos Wallet Adapter",
            nonce: Math.random().toString(16),
        };
        const response = await signMessageAndVerify(payload);
        setSuccessAlertMessage(
            JSON.stringify({ onSignMessageAndVerify: response })
        );
    };

    return <tr>
        <td className="px-8 py-4 border-t w-1/4">Feature functions</td>
        <td className="px-8 py-4 border-t w-3/4">
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
            <button
                className={`bg-orange-500 text-white font-bold py-2 px-4 rounded mr-4 ${
                    !connected
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-orange-700"
                }`}
                onClick={onSignTransaction}
                disabled={!connected}
            >
                Sign transaction
            </button>
            <button
                className={`bg-orange-500 text-white font-bold py-2 px-4 rounded mr-4 ${
                    !connected
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-orange-700"
                }`}
                onClick={onSignAndSubmitBCSTransaction}
                disabled={!connected}
            >
                Sign and submit BCS transaction
            </button>
        </td>
    </tr>;
}