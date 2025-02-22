import * as React from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { mainnetChains, mainnetChainTokens } from "./utils";
import { chainToIcon } from "@wormhole-foundation/sdk-icons";
import { truncateAddress } from "@aptos-labs/wallet-adapter-react";
import { Chain } from "@wormhole-foundation/sdk/dist/cjs";

export function ChainSelect({
  setSelectedSourceChain,
  selectedSourceChain,
}: {
  setSelectedSourceChain: (chain: Chain) => void;
  selectedSourceChain: Chain;
}) {
  const [selectedItem, setSelectedItem] =
    React.useState<Chain>(selectedSourceChain);

  const onSelectedSourceChainChangeClicked = (chain: string) => {
    setSelectedItem(chain as Chain);
    setSelectedSourceChain(chain as Chain);
  };

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
      <DropdownMenuContent className="w-full">
        {Object.values(mainnetChains).map((item, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() =>
              onSelectedSourceChainChangeClicked(item.displayName)
            }
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <img
                src={chainToIcon(item.icon as any)}
                alt={item.key}
                height="32px"
                width="32px"
              />
            </div>
            <div className="flex flex-col">
              <span className="ml-2">USDC</span>
              <a
                href={`${item.explorerUrl}/address/${mainnetChainTokens[item.key].tokenId.address}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ml-2 underline flex flex-row gap-2"
              >
                {truncateAddress(mainnetChainTokens[item.key].tokenId.address)}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
