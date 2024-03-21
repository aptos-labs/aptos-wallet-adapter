import { AccountAddress } from "@aptos-labs/ts-sdk";

const ChainIdToAnsContractAddressMap: Record<string, string> = {
  "1": "mainnet", // mainnet
  "2": "testnet", // testnet
};

export const getNameByAddress = async (
  chainId: string | number,
  address: string | AccountAddress
): Promise<string | null> => {
  try {
    // ANS supports only TESTNET or MAINNET
    if (!ChainIdToAnsContractAddressMap[chainId]) return null;
    const response = await fetch(
      `https://www.aptosnames.com/api/${ChainIdToAnsContractAddressMap[chainId]}/v1/name/${address}`
    );
    const data = await response.json();
    return data.name;
  } catch (e) {
    console.log("error", e);
    return null;
  }
};
