import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useAutoConnect } from "../components/AutoConnectProvider";
import {
  AccountInfo,
  NetworkInfo,
  WalletInfo,
} from "@aptos-labs/wallet-adapter-core";
import SingleSignerTransaction from "../components/transactionFlow/SingleSigner";
import SponsorTransaction from "../components/transactionFlow/Sponsor";
import MultiAgentTransaction from "../components/transactionFlow/MultiAgent";
import Row from "../components/Row";
import Col from "../components/Col";
import { Network } from "@aptos-labs/ts-sdk";
import { Typography } from "antd";

const { Link } = Typography;

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

const isSendableNetwork = (connected: boolean, network?: string): boolean => {
  return (
    connected &&
    (network?.toLowerCase() === Network.DEVNET.toLowerCase() ||
      network?.toLowerCase() === Network.TESTNET.toLowerCase())
  );
};

export default function App() {
  const { account, connected, network, wallet } = useWallet();

  return (
    <div>
      <h1 className="flex justify-center mt-2 mb-4 text-4xl font-extrabold tracking-tight leading-none text-black">
        Aptos Wallet Adapter Tester ({network?.name ?? ""})
      </h1>
      <Link
        href="https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nextjs-example"
        target="_blank"
        className="flex justify-center tracking-tight leading-none text-black"
      >
        Demo app source code
      </Link>
      <table className="table-auto w-full border-separate border-spacing-y-8 shadow-lg bg-white border-separate">
        <tbody>
          <WalletSelect />
          <AutoConnect />
          {connected && (
            <Row>
              <Col title={true} border={true}>
                <h3>
                  <b>Wallet Information</b>
                </h3>
              </Col>
              <Col border={true} />
            </Row>
          )}
          {connected && (
            <WalletProps wallet={wallet} network={network} account={account} />
          )}
          {connected && !isSendableNetwork(connected, network?.name) && (
            <tr>
              <Col title={true}></Col>
              <Col>
                <p style={{ color: "red" }}>
                  Transactions only work with Devnet or Testnet networks
                </p>
              </Col>
            </tr>
          )}
          {connected && (
            <SingleSignerTransaction isSendableNetwork={isSendableNetwork} />
          )}
          {connected && (
            <SponsorTransaction isSendableNetwork={isSendableNetwork} />
          )}
          {connected && (
            <MultiAgentTransaction isSendableNetwork={isSendableNetwork} />
          )}
        </tbody>
      </table>
    </div>
  );
}

function WalletSelect() {
  return (
    <>
      <Row>
        <Col title={true} border={true}>
          <h2>
            <b>Wallet Select</b>
          </h2>
        </Col>
        <Col border={true} />
      </Row>
      <Row>
        <Col title={true}>
          <h3>Connect a Wallet</h3>
        </Col>
        <Col>
          <WalletButtons />
        </Col>
      </Row>
      <Row>
        <Col title={true}>
          <h3>Ant Design</h3>
        </Col>
        <Col>
          <WalletSelectorAntDesign />
        </Col>
      </Row>
      <Row>
        <Col title={true}>
          <h3>MUI Design</h3>
        </Col>
        <Col>
          <WalletConnector />
        </Col>
      </Row>
    </>
  );
}

// TODO: Verify public key matches account
function WalletProps(props: {
  account: AccountInfo | null;
  network: NetworkInfo | null;
  wallet: WalletInfo | null;
}) {
  const { account, network, wallet } = props;
  const isValidNetworkName = () => {
    // TODO: Do we allow non lowercase
    return Object.values<string | undefined>(Network).includes(
      props.network?.name
    );
  };

  return (
    <>
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
          <DisplayRequiredValue
            name={"Address"}
            isCorrect={!!account?.address}
            value={account?.address}
          />
          <DisplayRequiredValue
            name={"Public key"}
            isCorrect={!!account?.publicKey}
            value={account?.publicKey?.toString()}
          />
          <DisplayOptionalValue
            name={"ANS Name (only if attached)"}
            value={account?.ansName}
          />
          <DisplayOptionalValue
            name={"Min keys required (only for multisig)"}
            value={account?.minKeysRequired?.toString()}
          />
        </Col>
      </Row>
      <Row>
        <Col title={true}>
          <h3>Network Info</h3>
        </Col>
        <Col>
          <DisplayRequiredValue
            name={"Network Name"}
            isCorrect={isValidNetworkName()}
            value={network?.name}
            expected={"one of: " + Object.values<string>(Network).join(", ")}
          />
          <DisplayOptionalValue name={"URL"} value={network?.url} />
          <DisplayOptionalValue name={"ChainId"} value={network?.chainId} />
        </Col>
      </Row>
    </>
  );
}

function DisplayRequiredValue(props: {
  name: string;
  isCorrect: boolean;
  value?: string;
  expected?: string;
}) {
  const { name, isCorrect, value, expected } = props;

  const successStyling = () => {
    if (isCorrect) {
      return { color: "green" };
    } else {
      return { color: "black", border: "2px solid red" };
    }
  };

  return (
    <div style={successStyling()}>
      <p>
        <b>{name}:</b> {value ?? "Not present"}{" "}
        {!isCorrect && expected && (
          <>
            <b>Expected:</b> {expected}
          </>
        )}
      </p>
    </div>
  );
}

function DisplayOptionalValue(props: { name: string; value?: string | null }) {
  return (
    <div>
      <p>
        <b>{props.name}:</b> {props.value ?? "Not present"}
      </p>
    </div>
  );
}

function AutoConnect() {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  return (
    <>
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
    </>
  );
}
