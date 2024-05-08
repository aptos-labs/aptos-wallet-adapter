import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";

import { aptosClient } from "../../utils";
import { useAlert } from "../AlertProvider";
import Button from "../Button";
import Col from "../Col";
import Row from "../Row";
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const MaxGasAMount = 10000;
type SingleSignerTransactionProps = {
  isSendableNetwork: (connected: boolean, network?: string) => boolean;
};

export default function TransactionParameters({
  isSendableNetwork,
}: SingleSignerTransactionProps) {
  const { setSuccessAlertMessage, setErrorAlertMessage } = useAlert();

  const { connected, account, network, signAndSubmitTransaction, wallet } =
    useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const onSignAndSubmitTransaction = async () => {
    if (!account) return;
    const transaction: InputTransactionData = {
      data: {
        function: "0x1::coin::transfer",
        typeArguments: [APTOS_COIN],
        functionArguments: [account.address, 1], // 1 is in Octas
      },
      options: { maxGasAmount: MaxGasAMount },
    };
    try {
      const commitedTransaction = await signAndSubmitTransaction(transaction);
      const executedTransaction = await aptosClient(network).waitForTransaction(
        {
          transactionHash: commitedTransaction.hash,
        }
      );
      // Check maxGasAmount is respected by the current connected Wallet
      if ((executedTransaction as any).max_gas_amount == MaxGasAMount) {
        setSuccessAlertMessage(
          `${wallet?.name} transaction ${executedTransaction.hash} executed with a max gas amount of ${MaxGasAMount}`
        );
      } else {
        setErrorAlertMessage(
          `${wallet?.name} transaction ${executedTransaction.hash} executed with a max gas amount of ${(executedTransaction as any).max_gas_amount}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row>
      <Col title={true} border={true}>
        <h3>Validate Transaction Parameters</h3>
      </Col>
      <Col border={true}>
        <Button
          color={"blue"}
          onClick={onSignAndSubmitTransaction}
          disabled={!sendable}
          message={"With MaxGasAmount"}
        />
      </Col>
    </Row>
  );
}
