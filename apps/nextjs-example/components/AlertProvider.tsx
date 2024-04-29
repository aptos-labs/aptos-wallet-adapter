import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { ErrorAlert, SuccessAlert } from "./Alert";
import { isAptosNetwork, NetworkInfo } from "@aptos-labs/wallet-adapter-core";

interface AlertContextState {
  setSuccessAlertHash: (hash: string, network: NetworkInfo | null) => void;
  setSuccessAlertMessage: Dispatch<SetStateAction<ReactNode | null>>;
  setErrorAlertMessage: Dispatch<SetStateAction<ReactNode | null>>;
}

export const AlertContext = createContext<AlertContextState | undefined>(
  undefined
);

export function useAlert(): AlertContextState {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error("useAlert must be used within an AlertProvider");
  return context;
}

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [successAlertMessage, setSuccessAlertMessage] =
    useState<ReactNode | null>(null);
  const [errorAlertMessage, setErrorAlertMessage] = useState<ReactNode | null>(
    null
  );

  const setSuccessAlertHash = useCallback(
    (hash: string, network: NetworkInfo | null) => {
      if (isAptosNetwork(network)) {
        const explorerLink = `https://explorer.aptoslabs.com/txn/${hash}${network?.name ? `?network=${network.name.toLowerCase()}` : ""}`;
        return setSuccessAlertMessage(
          <>
            View on Explorer:{" "}
            <a
              className="underline"
              target="_blank"
              href={explorerLink}
              rel={"noreferrer"}
            >
              {explorerLink}
            </a>
          </>
        );
      }

      return setSuccessAlertMessage(<>Transaction Hash: {hash}</>);
    },
    []
  );

  return (
    <AlertContext.Provider
      value={{
        setSuccessAlertHash,
        setSuccessAlertMessage,
        setErrorAlertMessage,
      }}
    >
      {successAlertMessage && (
        <SuccessAlert
          text={successAlertMessage}
          setText={setSuccessAlertMessage}
        />
      )}
      {errorAlertMessage && (
        <ErrorAlert text={errorAlertMessage} setText={setErrorAlertMessage} />
      )}
      {children}
    </AlertContext.Provider>
  );
};
