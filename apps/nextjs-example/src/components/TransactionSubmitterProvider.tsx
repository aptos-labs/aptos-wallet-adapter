"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TransactionSubmitterContextType {
  useCustomSubmitter: boolean;
  setUseCustomSubmitter: (value: boolean) => void;
}

const TransactionSubmitterContext = createContext<
  TransactionSubmitterContextType | undefined
>(undefined);

export function TransactionSubmitterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [useCustomSubmitter, setUseCustomSubmitter] = useState(false);

  return (
    <TransactionSubmitterContext.Provider
      value={{ useCustomSubmitter, setUseCustomSubmitter }}
    >
      {children}
    </TransactionSubmitterContext.Provider>
  );
}

export function useTransactionSubmitter() {
  const context = useContext(TransactionSubmitterContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionSubmitter must be used within a TransactionSubmitterProvider",
    );
  }
  return context;
}
