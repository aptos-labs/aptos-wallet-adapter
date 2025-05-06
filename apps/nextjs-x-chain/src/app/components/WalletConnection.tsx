import { DisplayValue, LabelValueGrid } from "@/components/LabelValueGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Network } from "@aptos-labs/ts-sdk";
import {
  AccountInfo,
  AdapterWallet,
  AptosChangeNetworkOutput,
  isAptosNetwork,
  NetworkInfo,
  OriginWalletDetails,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";

interface WalletConnectionProps {
  account: AccountInfo | null;
  network: NetworkInfo | null;
  wallet: AdapterWallet | null;
  originWalletDetails: OriginWalletDetails | undefined;
  changeNetwork: (network: Network) => Promise<AptosChangeNetworkOutput>;
}

export function WalletConnection({
  account,
  network,
  wallet,
  changeNetwork,
  originWalletDetails,
}: WalletConnectionProps) {
  const { isSolanaDerivedWallet, isEIP1193DerivedWallet } = useWallet();

  const isValidNetworkName = () => {
    if (isAptosNetwork(network)) {
      return Object.values<string | undefined>(Network).includes(network?.name);
    }
    // If the configured network is not an Aptos network, i.e is a custom network
    // we resolve it as a valid network name
    return true;
  };

  const isNetworkChangeSupported =
    wallet?.features["aptos:changeNetwork"] !== undefined;

  const aptosAccountInfoLabels = [
    {
      label: "Address",
      value: (
        <DisplayValue
          value={account?.address?.toString() ?? "Not Present"}
          isCorrect={!!account?.address}
        />
      ),
    },
    {
      label: "Public key",
      value: (
        <DisplayValue
          value={account?.publicKey?.toString() ?? "Not Present"}
          isCorrect={!!account?.publicKey}
        />
      ),
    },
    {
      label: "ANS name",
      subLabel: "(only if attached)",
      value: <p>{account?.ansName ?? "Not Present"}</p>,
    },
  ];
  if (
    wallet &&
    (isSolanaDerivedWallet(wallet) || isEIP1193DerivedWallet(wallet))
  ) {
    aptosAccountInfoLabels.push({
      label: "Origin Wallet Address",
      value: (
        <DisplayValue
          value={originWalletDetails?.address.toString() ?? "Not Present"}
          isCorrect={!!originWalletDetails?.address}
        />
      ),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-10 pt-6">
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Wallet Details</h4>
          <LabelValueGrid
            items={[
              {
                label: "Icon",
                value: wallet?.icon ? (
                  <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    width={24}
                    height={24}
                  />
                ) : (
                  "Not Present"
                ),
              },
              {
                label: "Name",
                value: <p>{wallet?.name ?? "Not Present"}</p>,
              },
              {
                label: "URL",
                value: wallet?.url ? (
                  <a
                    href={wallet.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-300"
                  >
                    {wallet.url}
                  </a>
                ) : (
                  "Not Present"
                ),
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Aptos Account Info</h4>
          <LabelValueGrid items={aptosAccountInfoLabels} />
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Network Info</h4>
          <LabelValueGrid
            items={[
              {
                label: "Network name",
                value: (
                  <DisplayValue
                    value={network?.name ?? "Not Present"}
                    isCorrect={isValidNetworkName()}
                    expected={Object.values<string>(Network).join(", ")}
                  />
                ),
              },
              {
                label: "URL",
                value: network?.url ? (
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-300"
                  >
                    {network.url}
                  </a>
                ) : (
                  "Not Present"
                ),
              },
              {
                label: "Chain ID",
                value: <p>{network?.chainId ?? "Not Present"}</p>,
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Change Network</h4>
          <RadioGroup
            value={network?.name}
            orientation="horizontal"
            className="flex gap-6"
            onValueChange={(value: Network) => changeNetwork(value)}
            disabled={!isNetworkChangeSupported}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.DEVNET} id="devnet-radio" />
              <Label htmlFor="devnet-radio">Devnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.TESTNET} id="testnet-radio" />
              <Label htmlFor="testnet-radio">Testnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.MAINNET} id="mainnet-radio" />
              <Label htmlFor="mainnet-radio">Mainnet</Label>
            </div>
          </RadioGroup>
          {!isNetworkChangeSupported && (
            <div className="text-sm text-red-600 dark:text-red-400">
              * {wallet?.name ?? "This wallet"} does not support network change
              requests
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
