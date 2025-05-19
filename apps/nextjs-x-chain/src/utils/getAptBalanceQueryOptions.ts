import {
  AccountAddressInput,
  Aptos,
  AptosConfig,
  InputViewFunctionJsonData,
  Network,
} from "@aptos-labs/ts-sdk";
import { queryOptions } from "@tanstack/react-query";

export function getAptBalanceQueryOptions({
  accountAddress,
  network,
}: {
  accountAddress: AccountAddressInput;
  network: Network;
}) {
  return queryOptions({
    queryKey: [
      "networks",
      network,
      "accounts",
      accountAddress.toString(),
      "aptBalance",
    ],
    queryFn: async () => {
      const aptos = new Aptos(new AptosConfig({ network: network }));

      const payload: InputViewFunctionJsonData = {
        function: "0x1::coin::balance",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [accountAddress.toString()],
      };
      const [balance] = await aptos.viewJson<[number]>({ payload: payload });
      return balance;
    },
    gcTime: 60000, // 1 minute
    staleTime: 5000, // 5 seconds
  });
}
