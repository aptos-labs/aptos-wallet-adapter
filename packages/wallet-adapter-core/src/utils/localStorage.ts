import { WalletName } from "../LegacyWalletPlugins/types";

const LOCAL_STORAGE_ITEM_KEY = "AptosWalletName";

export function setLocalStorage(walletName: WalletName) {
  localStorage.setItem(LOCAL_STORAGE_ITEM_KEY, walletName);
}

export function removeLocalStorage() {
  localStorage.removeItem(LOCAL_STORAGE_ITEM_KEY);
}

export function getLocalStorage() {
  localStorage.getItem(LOCAL_STORAGE_ITEM_KEY);
}
