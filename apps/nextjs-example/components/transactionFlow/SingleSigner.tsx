import { parseTypeTag, AccountAddress, U64 } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import { aptosClient } from "../../utils";
import { useAlert } from "../AlertProvider";
import Button from "../Button";
import Col from "../Col";
import Row from "../Row";
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
type SingleSignerTransactionProps = {
  isSendableNetwork: (connected: boolean, network?: string) => boolean;
};

export default function SingleSignerTransaction({
  isSendableNetwork,
}: SingleSignerTransactionProps) {
  const { setSuccessAlertMessage, setSuccessAlertHash } = useAlert();

  const {
    connected,
    account,
    network,
    signAndSubmitTransaction,
    signMessageAndVerify,
    signMessage,
    signTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

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

  const onSignMessage = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: Math.random().toString(16),
    };
    const response = await signMessage(payload);
    setSuccessAlertMessage(
      JSON.stringify({ onSignMessageAndVerify: response })
    );
  };

  const onSignAndSubmitTransaction = async () => {
    if (!account) return;

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address, 1], // 1 is in Octas
        },
      });
      console.log("response", response);
      await aptosClient(network?.name.toLowerCase()).waitForTransaction({
        transactionHash: response.hash,
      });
      setSuccessAlertHash(response.hash, network?.name);
    } catch (error) {
      console.error(error);
    }
  };

  const onSignAndSubmitBCSTransaction = async () => {
    if (!account) return;

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [parseTypeTag(APTOS_COIN)],
          functionArguments: [AccountAddress.from(account.address), new U64(1)], // 1 is in Octas
        },
      });
      await aptosClient(network?.name.toLowerCase()).waitForTransaction({
        transactionHash: response.hash,
      });
      setSuccessAlertHash(response.hash, network?.name);
    } catch (error) {
      console.error(error);
    }
  };

  const onSignTransaction = async () => {
    try {
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [account?.address, 1], // 1 is in Octas
      };
      const response = await signTransaction(payload);
      setSuccessAlertMessage(JSON.stringify(response));
    } catch (error) {
      console.error(error);
    }
  };

  const onSignTransactionV2 = async () => {
    if (!account) return;

    try {
      const transactionToSign = await aptosClient(
        network?.name.toLowerCase()
      ).build.transaction({
        sender: account.address,
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address, 1], // 1 is in Octas
        },
      });
      const response = await signTransaction(transactionToSign);
      setSuccessAlertMessage(JSON.stringify(response));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row>
      <Col title={true} border={true}>
        <h3>Single Signer Flow</h3>
      </Col>
      <Col border={true}>
        <Button
          color={"blue"}
          onClick={onSignAndSubmitTransaction}
          disabled={!sendable}
          message={"Sign and submit transaction"}
        />
        <Button
          color={"blue"}
          onClick={onSignAndSubmitBCSTransaction}
          disabled={!sendable}
          message={"Sign and submit BCS transaction"}
        />
        <Button
          color={"blue"}
          onClick={onSignTransaction}
          disabled={!sendable}
          message={"Sign transaction"}
        />
        <Button
          color={"blue"}
          onClick={onSignTransactionV2}
          disabled={!sendable}
          message={"Sign transaction V2"}
        />

        <Button
          color={"blue"}
          onClick={onSignMessage}
          disabled={!sendable}
          message={"Sign message"}
        />
        <Button
          color={"blue"}
          onClick={onSignMessageAndVerify}
          disabled={!sendable}
          message={"Sign message and verify"}
        />
      </Col>
    </Row>
  );
}
