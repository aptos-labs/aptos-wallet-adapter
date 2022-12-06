import type { FC, ReactNode } from "react";
import React, { createContext, useContext } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect(autoConnect: boolean): void;
}

export const AutoConnectContext = createContext<AutoConnectContextState>(
  {} as AutoConnectContextState
);

export function useAutoConnect(): AutoConnectContextState {
  return useContext(AutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [autoConnect, setAutoConnect] = useLocalStorage(
    "AptosWalletAutoConnect",
    true
  );

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
};
