import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import { mainnetTokens, testnetTokens } from "../config";
import { ethers, JsonRpcProvider } from "ethers";
import { Chain } from "../CrossChainCore";
import { SuiClient } from "@mysten/sui/client";

export const getSolanaWalletUSDCBalance = async (
  walletAddress: string,
  aptosNetwork: Network,
  rpc: string,
): Promise<string> => {
  const address = new PublicKey(walletAddress);
  const tokenAddress =
    aptosNetwork === Network.MAINNET
      ? mainnetTokens["Solana"].tokenId.address
      : testnetTokens["Solana"].tokenId.address;

  const connection = new Connection(rpc);
  // Find the token account for USDC
  const splToken = await connection.getTokenAccountsByOwner(address, {
    mint: new PublicKey(tokenAddress),
  });

  // If no token account exists, the wallet has never held USDC - balance is 0
  if (splToken.value.length === 0) {
    return "0";
  }

  const balance = await connection.getTokenAccountBalance(
    splToken.value[0]!.pubkey,
  );

  return (
    balance.value.uiAmountString ??
    ethers.formatUnits(BigInt(balance.value.amount), balance.value.decimals)
  );
};

export const getEthereumWalletUSDCBalance = async (
  walletAddress: string,
  aptosNetwork: Network,
  chain: Chain,
  rpc: string,
): Promise<string> => {
  const token =
    aptosNetwork === Network.MAINNET
      ? mainnetTokens[chain]
      : testnetTokens[chain];

  const tokenAddress = token.tokenId.address;
  const connection = new JsonRpcProvider(rpc);
  const abi = ["function balanceOf(address owner) view returns (uint256)"];
  const contract = new ethers.Contract(tokenAddress, abi, connection);
  const balance = await contract.balanceOf(walletAddress);
  return ethers.formatUnits(balance, token.decimals).toString();
};

export const getAptosWalletUSDCBalance = async (
  walletAddress: string,
  aptosNetwork: Network,
): Promise<string> => {
  const token =
    aptosNetwork === Network.MAINNET
      ? mainnetTokens["Aptos"]
      : testnetTokens["Aptos"];
  const tokenAddress = token.tokenId.address;
  const aptosConfig = new AptosConfig({ network: aptosNetwork });
  const connection = new Aptos(aptosConfig);
  const response = await connection.getCurrentFungibleAssetBalances({
    options: {
      where: {
        owner_address: { _eq: walletAddress },
        asset_type: { _eq: tokenAddress },
      },
    },
  });
  if (response.length === 0) {
    return "0";
  }
  return ethers.formatUnits(BigInt(response[0].amount), token.decimals);
};

export const getSuiWalletUSDCBalance = async (
  walletAddress: string,
  aptosNetwork: Network,
  rpc: string,
): Promise<string> => {
  const token =
    aptosNetwork === Network.MAINNET
      ? mainnetTokens["Sui"]
      : testnetTokens["Sui"];

  const client = new SuiClient({
    url: rpc,
  });
  const balance = await client.getBalance({
    owner: walletAddress,
    coinType: token.tokenId.address,
  });
  // Reuse ethers' formatter for precise decimal formatting of large integers.
  return ethers.formatUnits(BigInt(balance.totalBalance), token.decimals);
};
