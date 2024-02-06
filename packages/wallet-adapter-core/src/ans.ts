const ChainIdToAnsContractAddressMap: Record<string, string> = {
  "1": "mainnet", // mainnet
  "2": "testnet", // testnet
};

export const getNameByAddress = async (
  chainId: string,
  address: string
): Promise<string | undefined> => {
  try {
    if (!ChainIdToAnsContractAddressMap[chainId]) return undefined;
    const response = await fetch(
      `https://www.aptosnames.com/api/${ChainIdToAnsContractAddressMap[chainId]}/v1/name/${address}`
    );
    const data = await response.json();
    return data.name;
  } catch (e) {
    console.log("error", e);
    return undefined;
  }
};
