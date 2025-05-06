import { aptosClient, isSendableNetwork } from "@/utils";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../ui/use-toast";

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const MaxGasAMount = 10000;

export function TransactionParameters() {
  const { toast } = useToast();
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
        },
      );
      // Check maxGasAmount is respected by the current connected Wallet
      if ((executedTransaction as any).max_gas_amount == MaxGasAMount) {
        toast({
          title: "Success",
          description: `${wallet?.name ?? "Wallet"} transaction ${executedTransaction.hash} executed with a max gas amount of ${MaxGasAMount}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: `${wallet?.name ?? "Wallet"} transaction ${executedTransaction.hash} executed with a max gas amount of ${(executedTransaction as any).max_gas_amount}`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validate Transaction Parameters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button onClick={onSignAndSubmitTransaction} disabled={!sendable}>
          With MaxGasAmount
        </Button>
      </CardContent>
    </Card>
  );
}
