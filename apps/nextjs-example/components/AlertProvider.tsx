import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { ErrorAlert, SuccessAlert } from "./Alert";

interface AlertContextState {
  successAlertMessage: string | null;
  setSuccessAlertMessage: Dispatch<SetStateAction<string | null>>;
  errorAlertMessage: string | null;
  setErrorAlertMessage: Dispatch<SetStateAction<string | null>>;
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
  const [successAlertMessage, setSuccessAlertMessage] = useState<string | null>(
    null
  );
  const [errorAlertMessage, setErrorAlertMessage] = useState<string | null>(
    null
  );

  return (
    <AlertContext.Provider
      value={{
        successAlertMessage,
        setSuccessAlertMessage,
        errorAlertMessage,
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
