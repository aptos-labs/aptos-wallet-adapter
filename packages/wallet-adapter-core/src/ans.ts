const ChainIdToAnsContractAddressMap: Record<string, string> = {
  "1": "mainnet", // mainnet
  "2": "testnet", // testnet
};

export const getNameByAddress = async (
  chainId: string,
  address: string
): Promise<string | null> => {
  if (!ChainIdToAnsContractAddressMap[chainId]) return null;
  // TODO use /primary-name endpoint
  const response = await fetch(
    `https://www.aptosnames.com/api/${ChainIdToAnsContractAddressMap[chainId]}/v1/name/${address}`
  );
  const data = await response.json();
  return data?.name;
};
