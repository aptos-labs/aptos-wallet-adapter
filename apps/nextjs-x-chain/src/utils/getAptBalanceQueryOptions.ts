import {
  AccountAddressInput,
  Aptos,
  AptosConfig,
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
      return aptos.getAccountCoinAmount({
        accountAddress,
        coinType: "0x1::aptos_coin::AptosCoin",
      });
    },
    gcTime: 60000, // 1 minute
    staleTime: 5000, // 5 seconds
  });
}
