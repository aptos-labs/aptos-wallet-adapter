import {
  Aptos,
  AptosConfig,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  TransactionSubmitter,
} from "@aptos-labs/ts-sdk";

/**
 * This is a dummy transaction submitter that just logs the transaction and then
 * submits it normally.
 */
class MyTransactionSubmitter implements TransactionSubmitter {
  submitTransaction(
    args: { aptosConfig: AptosConfig } & Omit<
      InputSubmitTransactionData,
      "transactionSubmitter"
    >,
  ): Promise<PendingTransactionResponse> {
    const { aptosConfig } = args;
    console.log("Submitting transaction with MyTransactionSubmitter", args);
    const aptos = new Aptos(aptosConfig);
    return aptos.transaction.submit.simple({
        ...args,
        // We do this so we don't recurse back to this function but instead use the
        // proper regular txn submitter.
        transactionSubmitter: null,
    });
  }
}

export const myTransactionSubmitter = new MyTransactionSubmitter();
