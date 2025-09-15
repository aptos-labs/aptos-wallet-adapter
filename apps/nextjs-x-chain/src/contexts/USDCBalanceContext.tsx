"use client";

import { CrossChainCore } from "@aptos-labs/cross-chain-core";
import { Chain } from "@aptos-labs/cross-chain-core";
import { Network } from "@aptos-labs/ts-sdk";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface USDCBalanceContextType {
  aptosBalance: string | undefined;
  originBalance: string | undefined;
  isLoadingAptosBalance: boolean;
  isLoadingOriginBalance: boolean;
  globalTransactionInProgress: boolean;
  fetchAptosBalance: (address: string) => Promise<void>;
  fetchOriginBalance: (address: string, chain: Chain) => Promise<void>;
  refetchBalances: () => Promise<void>;
  refetchBalancesWithDelay: (delayMs?: number) => Promise<void>;
  refetchAptosBalanceWithDelay: (delayMs?: number) => Promise<void>;
  setGlobalTransactionInProgress: (inProgress: boolean) => void;
}

const USDCBalanceContext = createContext<USDCBalanceContextType | undefined>(
  undefined,
);

interface USDCBalanceProviderProps {
  children: ReactNode;
  dappNetwork: Network.MAINNET | Network.TESTNET;
}

export function USDCBalanceProvider({
  children,
  dappNetwork,
}: USDCBalanceProviderProps) {
  // Initialize crossChainCore with the prop
  const crossChainCore = new CrossChainCore({
    dappConfig: { aptosNetwork: dappNetwork },
  });

  const [aptosBalance, setAptosBalance] = useState<string | undefined>(
    undefined,
  );
  const [originBalance, setOriginBalance] = useState<string | undefined>(
    undefined,
  );
  const [isLoadingAptosBalance, setIsLoadingAptosBalance] = useState(false);
  const [isLoadingOriginBalance, setIsLoadingOriginBalance] = useState(false);
  const [globalTransactionInProgress, setGlobalTransactionInProgress] =
    useState(false);

  // Store the last used parameters for refetching
  const [lastAptosAddress, setLastAptosAddress] = useState<string | undefined>(
    undefined,
  );
  const [lastOriginAddress, setLastOriginAddress] = useState<
    string | undefined
  >(undefined);
  const [lastOriginChain, setLastOriginChain] = useState<Chain | undefined>(
    undefined,
  );

  const fetchAptosBalance = useCallback(async (address: string) => {
    if (!address) return;

    setIsLoadingAptosBalance(true);
    setLastAptosAddress(address);

    try {
      const balance = await crossChainCore.getWalletUSDCBalance(
        address,
        "Aptos",
      );
      setAptosBalance(balance);
    } catch (error) {
      console.error("Error fetching Aptos USDC balance:", error);
      setAptosBalance(undefined);
    } finally {
      setIsLoadingAptosBalance(false);
    }
  }, []);

  const fetchOriginBalance = useCallback(
    async (address: string, chain: Chain) => {
      if (!address || !chain) return;

      setIsLoadingOriginBalance(true);
      setLastOriginAddress(address);
      setLastOriginChain(chain);

      try {
        const balance = await crossChainCore.getWalletUSDCBalance(
          address,
          chain,
        );
        setOriginBalance(balance);
      } catch (error) {
        console.error("Error fetching origin USDC balance:", error);
        setOriginBalance(undefined);
      } finally {
        setIsLoadingOriginBalance(false);
      }
    },
    [],
  );

  const refetchBalances = useCallback(async () => {
    const promises = [];

    if (lastAptosAddress) {
      promises.push(fetchAptosBalance(lastAptosAddress));
    }

    if (lastOriginAddress && lastOriginChain) {
      promises.push(fetchOriginBalance(lastOriginAddress, lastOriginChain));
    }

    await Promise.all(promises);
  }, [
    lastAptosAddress,
    lastOriginAddress,
    lastOriginChain,
    fetchAptosBalance,
    fetchOriginBalance,
  ]);

  const refetchAptosBalanceWithRetry = useCallback(
    async (maxRetries: number = 3, initialDelayMs: number = 5000) => {
      if (!lastAptosAddress) return;

      let retryCount = 0;
      const originalBalance = aptosBalance;

      const attemptFetch = async (delayMs: number): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const balance = await crossChainCore.getWalletUSDCBalance(
                lastAptosAddress,
                "Aptos",
              );

              // Check if balance actually changed (indicating transaction was processed)
              if (balance !== originalBalance) {
                setAptosBalance(balance);
                resolve();
                return;
              }

              // If balance hasn't changed and we have retries left, try again
              if (retryCount < maxRetries) {
                retryCount++;
                const nextDelay = delayMs * 1.5; // Exponential backoff
                console.log(
                  `Aptos balance unchanged, retrying in ${nextDelay}ms (attempt ${retryCount}/${maxRetries})`,
                );
                await attemptFetch(nextDelay);
                resolve();
              } else {
                // Final attempt - set the balance even if unchanged
                setAptosBalance(balance);
                resolve();
              }
            } catch (error) {
              console.error(
                `Error fetching Aptos balance (attempt ${retryCount + 1}):`,
                error,
              );
              if (retryCount < maxRetries) {
                retryCount++;
                const nextDelay = delayMs * 1.5;
                await attemptFetch(nextDelay);
              }
              resolve();
            }
          }, delayMs);
        });
      };

      await attemptFetch(initialDelayMs);
    },
    [lastAptosAddress, aptosBalance],
  );

  const refetchBalancesWithDelay = useCallback(
    async (delayMs: number = 5000) => {
      // Immediately refetch origin balance
      if (lastOriginAddress && lastOriginChain) {
        await fetchOriginBalance(lastOriginAddress, lastOriginChain);
      }

      // Use retry mechanism for Aptos balance
      await refetchAptosBalanceWithRetry(3, delayMs);
    },
    [
      lastOriginAddress,
      lastOriginChain,
      fetchOriginBalance,
      refetchAptosBalanceWithRetry,
    ],
  );

  const refetchAptosBalanceWithDelay = useCallback(
    async (delayMs: number = 5000) => {
      if (lastAptosAddress) {
        setTimeout(async () => {
          await fetchAptosBalance(lastAptosAddress);
        }, delayMs);
      }
    },
    [lastAptosAddress, fetchAptosBalance],
  );

  const value: USDCBalanceContextType = {
    aptosBalance,
    originBalance,
    isLoadingAptosBalance,
    isLoadingOriginBalance,
    globalTransactionInProgress,
    fetchAptosBalance,
    fetchOriginBalance,
    refetchBalances,
    refetchBalancesWithDelay,
    refetchAptosBalanceWithDelay,
    setGlobalTransactionInProgress,
  };

  return (
    <USDCBalanceContext.Provider value={value}>
      {children}
    </USDCBalanceContext.Provider>
  );
}

export function useUSDCBalance(): USDCBalanceContextType {
  const context = useContext(USDCBalanceContext);
  if (context === undefined) {
    throw new Error("useUSDCBalance must be used within a USDCBalanceProvider");
  }
  return context;
}
