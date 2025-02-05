import * as React from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  mainnetChains,
  mainnetChainTokens,
  testnetChains,
  testnetChainTokens,
} from "../utils/index";
import { chainToIcon } from "@wormhole-foundation/sdk-icons";
import { truncateAddress } from "@aptos-labs/wallet-adapter-react";
import { Chain } from "@wormhole-foundation/sdk/dist/cjs";

export function ChainSelect({
  setSelectedSourceChain,
  selectedSourceChain,
  isMainnet,
}: {
  setSelectedSourceChain: (chain: Chain) => void;
  selectedSourceChain: Chain;
  isMainnet: boolean;
}) {
  const [selectedItem, setSelectedItem] =
    React.useState<Chain>(selectedSourceChain);

  const onSelectedSourceChainChangeClicked = (chain: string) => {
    setSelectedItem(chain as Chain);
    setSelectedSourceChain(chain as Chain);
  };

  const chains = isMainnet ? mainnetChains : testnetChains;

  const chainTokens = isMainnet ? mainnetChainTokens : testnetChainTokens;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedItem ? (
            <>
              <img
                src={chainToIcon(selectedItem as any)}
                alt={selectedItem}
                height="32px"
                width="32px"
              />
              <span className="ml-2">USDC</span>
            </>
          ) : (
            "Select an item"
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.values(chains).map((chain, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() =>
              onSelectedSourceChainChangeClicked(chain.displayName)
            }
          >
            <img
              src={chainToIcon(chain.icon as any)}
              alt={chain.key}
              height="32px"
              width="32px"
            />
            <div>
              <span className="ml-2">USDC</span>
              <a
                href={`${chain.explorerUrl}/address/${chainTokens[chain.key].tokenId.address}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ml-2 underline flex flex-row gap-2"
              >
                {truncateAddress(chainTokens[chain.key].tokenId.address)}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
