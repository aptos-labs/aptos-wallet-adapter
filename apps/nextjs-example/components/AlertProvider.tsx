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
  successAlertMessage: string;
  setSuccessAlertMessage: Dispatch<SetStateAction<string>>;
  errorAlertMessage: string;
  setErrorAlertMessage: Dispatch<SetStateAction<string>>;
}

export const AlertContext = createContext<AlertContextState>(
  {} as AlertContextState
);

export function useAlert(): AlertContextState {
  return useContext(AlertContext);
}

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [successAlertMessage, setSuccessAlertMessage] = useState<string>("");
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>("");

  return (
    <AlertContext.Provider
      value={{
        successAlertMessage,
        setSuccessAlertMessage,
        errorAlertMessage,
        setErrorAlertMessage,
      }}
    >
      {successAlertMessage && successAlertMessage.length > 0 && (
        <SuccessAlert
          text={successAlertMessage}
          setSuccessAlertMessage={setSuccessAlertMessage}
        />
      )}
      {errorAlertMessage && errorAlertMessage.length > 0 && (
        <ErrorAlert
          text={errorAlertMessage}
          setErrorAlertMessage={setErrorAlertMessage}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
};
