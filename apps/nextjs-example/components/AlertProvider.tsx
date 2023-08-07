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

interface AlertContextState {
  setSuccessAlertHash: (hash: string, networkName?: string) => void;
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
    (hash: string, networkName?: string) => {
      const explorerLink = `https://explorer.aptoslabs.com/txn/${hash}${
        networkName ? `?network=${networkName.toLowerCase()}` : ""
      }`;
      setSuccessAlertMessage(
        <>
          View on Explorer:{" "}
          <a className="underline" target="_blank" href={explorerLink} rel={"noreferrer"}>
            {explorerLink}
          </a>
        </>
      );
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
