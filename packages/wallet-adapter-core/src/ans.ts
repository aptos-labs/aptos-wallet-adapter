import { AptosClient } from "aptos";

const ChainIdToAnsContractAddressMap: Record<string, string> = {
  "1": "0x867ed1f6bf916171b1de3ee92849b8978b7d1b9e0a8cc982a3d19d535dfd9c0c", // mainnet
  "2": "0x5f8fd2347449685cf41d4db97926ec3a096eaf381332be4f1318ad4d16a8497c", // testnet
};

type ANSResponse = {
  name: string;
};

export const getNameByAddress = async (
  chainId: string,
  address: string
): Promise<string | null> => {
  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

  try {
    const ansResource = await client.getAccountResource(
      ChainIdToAnsContractAddressMap[chainId],
      `${ChainIdToAnsContractAddressMap[chainId]}::domains::ReverseLookupRegistryV1`
    );

    const handle = (ansResource as any).data.registry.handle;
    const domainsTableItemRequest = {
      key_type: "address",
      value_type: `${ChainIdToAnsContractAddressMap[chainId]}::domains::NameRecordKeyV1`,
      key: address,
    };

    const item = await client.getTableItem(handle, domainsTableItemRequest);
    return item.domain_name;
  } catch (e) {
    console.log("error", e);
    return null;
  }
};
