import {
    APTOS_COIN,
    AptosAccount,
    AptosClient,
    BCS,
    CoinClient,
    FaucetClient, HexString,
    Network,
    Provider,
    TxnBuilderTypes,
    Types
} from "aptos";
import { AccountAddress, U64, parseTypeTag } from "@aptos-labs/ts-sdk";
import {NetworkName, useWallet} from "@aptos-labs/wallet-adapter-react";
import {WalletConnector} from "@aptos-labs/wallet-adapter-mui-design";
import dynamic from "next/dynamic";
import Image from "next/image";
import {useAutoConnect} from "../components/AutoConnectProvider";
import {useAlert} from "../components/AlertProvider";
import {AccountInfo, NetworkInfo, WalletInfo} from "@aptos-labs/wallet-adapter-core";
import {useState} from "react";

const FEE_PAYER_ACCOUNT_KEY = "feePayerAccountPrivateKey";
const DO_NOTHING_SCRIPT = "a11ceb0b0600000001050001000000000102";

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

const aptosClient = (network?: string) => {
    if (network === NetworkName.Devnet.toLowerCase()) {
        return DEVNET_CLIENT;
    } else if (network === NetworkName.Testnet.toLowerCase()) {
        return TESTNET_CLIENT;
    } else if (network === NetworkName.Mainnet.toLowerCase()) {
        throw new Error("Please use devnet or testnet for testing");
    } else {
        throw new Error(`Unknown network: ${network}`);
    }
}

const faucet = (network?: string) => {
    if (network === NetworkName.Devnet.toLowerCase()) {
        return DEVNET_FAUCET;
    } else if (network === NetworkName.Testnet.toLowerCase()) {
        return TESTNET_FAUCET;
    } else if (network === NetworkName.Mainnet.toLowerCase()) {
        throw new Error("Please use devnet or testnet for testing");
    } else {
        throw new Error(`Unknown network: ${network}`);
    }
}

const DEVNET_CLIENT = new Provider(Network.DEVNET);
const TESTNET_CLIENT = new Provider(Network.TESTNET);
const DEVNET_FAUCET = new FaucetClient("https://fullnode.devnet.aptoslabs.com", "https://faucet.devnet.aptoslabs.com");
const TESTNET_FAUCET = new FaucetClient("https://fullnode.testnet.aptoslabs.com", "https://faucet.testnet.aptoslabs.com");

const isSendableNetwork = (connected: boolean, network?: string): boolean => {
    return connected && (network?.toLowerCase() === NetworkName.Devnet.toLowerCase()
        || network?.toLowerCase() === NetworkName.Testnet.toLowerCase())
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
                {connected && <Row><Col title={true} border={true}>
                    <h3><b>Wallet Information</b></h3>
                </Col>
                    <Col border={true}/>
                </Row>}
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
        <Row>
            <Col title={true} border={true}>
                <h2><b>Wallet Select</b></h2>
            </Col>
            <Col border={true}/>
        </Row>
        <Row>
            <Col title={true}>
                <h3>Connect a Wallet</h3>
            </Col>
            <Col>
                <WalletButtons/>
            </Col>
        </Row>
        <Row>
            <Col title={true}>
                <h3>Ant Design</h3>
            </Col>
            <Col>
                <WalletSelectorAntDesign/>
            </Col>
        </Row>
        <Row>
            <Col title={true}>
                <h3>MUI Design</h3>
            </Col>
            <Col>
                <WalletConnector/>
            </Col>
        </Row>
    </>;
}

// TODO: Verify public key matches account
function WalletProps(props: { account: AccountInfo | null, network: NetworkInfo | null, wallet: WalletInfo | null }) {
    const {account, network, wallet} = props;
    const isValidNetworkName = () => {
        // TODO: Do we allow non lowercase
        return Object.values<string | undefined>(NetworkName).includes(props.network?.name);
    }

    return <>
        <tr>
            <Col title={true}>
                <h3>Wallet Name</h3>
            </Col>
            <Col>
                <b>Icon: </b>
                {props.wallet && (
                    <Image
                        src={wallet?.icon ?? ""}
                        alt={wallet?.name ?? ""}
                        width={25}
                        height={25}
                    />
                )}
                <b> Name: </b>
                {wallet?.name}
                <b> URL: </b>
                <a
                    target="_blank"
                    className="text-sky-600"
                    rel="noreferrer"
                    href={wallet?.url}
                >
                    {wallet?.url}
                </a>
            </Col>
        </tr>
        <Row>
            <Col title={true}>
                <h3>Account Info</h3>
            </Col>
            <Col>
                <DisplayRequiredValue name={"Address"} isCorrect={!!account?.address}
                                      value={account?.address}/>
                <DisplayRequiredValue name={"Public key"} isCorrect={!!account?.publicKey}
                                      value={account?.publicKey?.toString()}/>
                <DisplayOptionalValue name={"ANS Name (only if attached)"} value={account?.ansName}/>
                <DisplayOptionalValue name={"Min keys required (only for multisig)"}
                                      value={account?.minKeysRequired?.toString()}/>
            </Col>
        </Row>
        <Row>
            <Col title={true}>
                <h3>Network Info</h3>
            </Col>
            <Col>
                <DisplayRequiredValue name={"Network Name"} isCorrect={isValidNetworkName()} value={network?.name}
                                      expected={"one of: " + Object.values<string>(NetworkName).join(", ")}/>
                <DisplayOptionalValue name={"URL"} value={network?.url}/>
                <DisplayOptionalValue name={"ChainId"} value={network?.chainId}/>
            </Col>
        </Row>
    </>;
}

function DisplayRequiredValue(props: { name: string, isCorrect: boolean, value?: string, expected?: string }) {
    const {name, isCorrect, value, expected} = props;

    const successStyling = () => {
        if (isCorrect) {
            return {color: 'green'}
        } else {
            return {color: 'black', border: '2px solid red'}
        }
    }

    return <div style={successStyling()}><p>
        <b>{name}:</b> {value ?? "Not present"} {!isCorrect && expected && <>
        <b>Expected:</b> {expected}</>}</p></div>
}

function DisplayOptionalValue(props: { name: string, value?: string | null }) {
    return <div><p><b>{props.name}:</b> {props.value ?? "Not present"}</p></div>
}

function AutoConnect() {
    const {autoConnect, setAutoConnect} = useAutoConnect();
    return <>
        <Row>
            <Col title={true} border={true}>
                <h3>Auto reconnect on page open</h3>
            </Col>
            <Col border={true}>
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
            </Col>
        </Row>
    </>;
}

function RequiredFunctionality() {
    const {setSuccessAlertMessage, setSuccessAlertHash} = useAlert();

    // TODO: pass as props
    const {
        connected,
        disconnect,
        account,
        network,
        signAndSubmitTransaction,
        signMessage,
    } = useWallet();
    let sendable = isSendableNetwork(connected, network?.name)

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

    return <Row>
        <Col title={true} border={true}>
            <h3>Standard Functions</h3>
        </Col>
        <Col border={true}>
            <Button color={"blue"} onClick={disconnect} disabled={!connected} message={"Disconnect"}/>
            <Button color={"blue"} onClick={onSignAndSubmitTransaction} disabled={!sendable}
                    message={"Sign and submit transaction"}/>
            <Button color={"blue"} onClick={onSignMessage} disabled={!sendable} message={"Sign message"}/>
        </Col>
    </Row>;
}

function OptionalFunctionality() {
    const [initializedFeePayer, setInitializedFeePayer] = useState<boolean>(false);
    const {setSuccessAlertMessage, setSuccessAlertHash} = useAlert();
    // TODO: pass as props
    const {
        connected,
        account,
        network,
        signAndSubmitTransaction,
        signAndSubmitBCSTransaction,
        signTransaction,
        signMessageAndVerify,
        signMultiAgentTransaction,
        submitTransaction,
    } = useWallet();
    let sendable = isSendableNetwork(connected, network?.name)

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
            JSON.stringify({onSignMessageAndVerify: response})
        );
    };

    const loadFeePayerAccount = (): AptosAccount => {
        // Check if it exists in local storage
        let maybeFeePayer = window.localStorage.getItem(FEE_PAYER_ACCOUNT_KEY);
        if (!maybeFeePayer) {
            let feePayerAccount = new AptosAccount();
            window.localStorage.setItem(FEE_PAYER_ACCOUNT_KEY, feePayerAccount.toPrivateKeyObject().privateKeyHex)
            return feePayerAccount;
        } else {
            let key = HexString.ensure(maybeFeePayer).toUint8Array();
            return new AptosAccount(key);
        }
    }

    // TODO: Let's put this into a cookie or local storage so it only happens once
    const fundAndSetFeePayer = async (client: AptosClient): Promise<AptosAccount> => {
        // Check if it exists in local storage
        let feePayerAccount = loadFeePayerAccount();
        let feePayerAddress = feePayerAccount.address();

        if (initializedFeePayer) {
            return feePayerAccount;
        }

        try {
            let coinClient = new CoinClient(client);
            let balance = await coinClient.checkBalance(feePayerAddress);
            if (Number(balance) >= 100000000) {
                setInitializedFeePayer(true);
                return feePayerAccount;
            }
        } catch (error: any) {
            // Swallow errors, likely due to account not existing
        }
        await (faucet(network?.name.toLowerCase()).fundAccount(feePayerAddress, 100000000));

        setInitializedFeePayer(true);
        return feePayerAccount;
    }

    const onSubmitFeePayer = async () => {
        if (!account) {
            throw new Error("Not connected");
        }

        // TODO: MultiSig isn't supported here properly
        // This is not supporting multi sig, if 0 or undefined
        if (account.minKeysRequired) {
            throw new Error("MultiSig not supported");
        }

        let provider = aptosClient(network?.name.toLowerCase());
        // Generate an account and fund it
        let feePayerAccount = await fundAndSetFeePayer(provider);

        const payload: Types.TransactionPayload = {
            type: "entry_function_payload",
            function: "0x1::aptos_account::transfer",
            type_arguments: [],
            arguments: [account.address, 1], // 1 is in Octas
        };

        // This would normally be provided by the service or a server
        // We need to increase the default timeout
        let expiration_timestamp_secs = Math.floor(Date.now() / 1000) + 60000;

        const rawTxn = await provider.generateFeePayerTransaction(account.address, payload, feePayerAccount.address().hex(), [], {expiration_timestamp_secs: expiration_timestamp_secs.toString()})

        // Sign with fee payer
        const feePayerAuthenticator = await provider.signMultiTransaction(feePayerAccount, rawTxn);

        // Sign with user
        const userSignature  = await signMultiAgentTransaction(rawTxn);
        // TODO: Why do we need to check this when the error should fail?
        if (!userSignature) {
            return;
        }

        // TODO: This extra code here needs to be put into the wallet adapter
        let userAuthenticator = new TxnBuilderTypes.AccountAuthenticatorEd25519(
            new TxnBuilderTypes.Ed25519PublicKey(HexString.ensure(account.publicKey as string).toUint8Array()),
            new TxnBuilderTypes.Ed25519Signature(HexString.ensure(userSignature as string).toUint8Array())
        );

        // Submit it TODO: the wallet possibly should send it instead?
        let response: undefined | Types.PendingTransaction = undefined;
            response = await provider.submitFeePayerTransaction(rawTxn, userAuthenticator, feePayerAuthenticator);
            if (response?.hash === undefined) {
                throw new Error(`No response given ${response}`)
            }
            await aptosClient(network?.name.toLowerCase()).waitForTransaction(response.hash);
            setSuccessAlertHash(response.hash, network?.name);

        setSuccessAlertMessage(
            JSON.stringify({signAndSubmitTransaction: response ?? "No response"})
        );
    };

    const onSubmitTransaction = async () => {
        if(!account){
            throw new Error("Account not connected");
        }
        const response = await submitTransaction({
            sender: account.address,
            data: {
                function: "0x1::coin::transfer",
                typeArguments: [parseTypeTag(APTOS_COIN)],
                functionArguments: [AccountAddress.fromHexInputRelaxed(account.address), new U64(1)], // 1 is in Octas
            }
        });
        try {
            await aptosClient(network?.name.toLowerCase()).waitForTransaction(response.hash);
            setSuccessAlertHash(response.hash, network?.name);
        } catch (error) {
            console.error(error);
        }
    };

    return <Row>
        <Col title={true} border={true}>
            <h3>Optional Feature Functions</h3>
        </Col>
        <Col border={true}>
            <Button color={"blue"} onClick={onSignMessageAndVerify} disabled={!sendable}
                    message={"Sign message and verify"}/>
            <Button color={"blue"} onClick={onSignTransaction} disabled={!sendable} message={"Sign transaction"}/>
            <Button color={"blue"} onClick={onSignAndSubmitBCSTransaction} disabled={!sendable}
                    message={"Sign and submit BCS transaction"}/>
            <Button color={"blue"} onClick={onSubmitFeePayer} disabled={!sendable}
                    message={"Sign and submit fee payer"}/>
            <Button color={"blue"} onClick={onSubmitTransaction} disabled={!sendable}
                    message={"Sign and submit with the @aptos-labs/ts-sdk"}/>
        </Col>
    </Row>;
}

function Row(props: { children?: React.ReactNode }) {
    return <tr>
        {props.children}
    </tr>
}

function Col(props: { title?: boolean, border?: boolean, children?: React.ReactNode }) {
    return <td className={`px-8 py-4 ${props.border ? "border-t" : ""} w-${props.title ? "1/4" : "3/4"}`}>
        {props.children}
    </td>
}

function Button(props: { color: string | undefined, onClick: () => void, disabled: boolean, message: string }) {
    const {color, onClick, disabled, message} = props;
    return <button
        className={`bg-${color}-500 text-white font-bold py-2 px-4 rounded mr-4 ${
            disabled
                ? "opacity-50 cursor-not-allowed"
                : `hover:bg-${color}-700`
        }`}
        onClick={onClick}
        disabled={disabled}
    >{message}</button>
}