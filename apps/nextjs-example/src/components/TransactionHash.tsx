import { NetworkInfo, isAptosNetwork } from "@aptos-labs/wallet-adapter-core";

export interface TransactionHashProps {
  hash: string;
  network: NetworkInfo | null;
}

export function TransactionHash({ hash, network }: TransactionHashProps) {
  if (isAptosNetwork(network)) {
    const explorerLink = `https://explorer.aptoslabs.com/txn/${hash}${network?.name ? `?network=${network.name}` : ""}`;
    return (
      <>
        View on Explorer:{" "}
        <a
          href={explorerLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-300"
        >
          {explorerLink}
        </a>
      </>
    );
  }

  return <>Transaction Hash: {hash}</>;
}
