import { WalletName } from "../types";

export function setLocalStorage(walletName: WalletName) {
  localStorage.setItem("wallet", walletName);
}

export function removeLocalStorage() {
  localStorage.removeItem("wallet");
}

export function getLocalStorage() {
  localStorage.getItem("wallet");
}
