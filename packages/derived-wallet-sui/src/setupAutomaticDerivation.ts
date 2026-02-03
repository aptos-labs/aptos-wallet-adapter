import { getWallets } from "@mysten/wallet-standard";
import type { Wallet } from "@mysten/wallet-standard";
import { SuiDerivedWallet, SuiDomainWalletOptions } from "./SuiDerivedWallet";

export function setupAutomaticSuiWalletDerivation(
  options: SuiDomainWalletOptions = {},
) {
  const api = getWallets();

  type UnsubscribeCallback = () => void;
  const registrations: { [name: string]: UnsubscribeCallback } = {};

  const deriveAndRegisterWallet = (wallet: Wallet) => {
    const derivedWallet = new SuiDerivedWallet(wallet, options);
    registrations[wallet.name] = api.register(derivedWallet);
  };

  const supportsSui = (wallet: Wallet): boolean => {
    const { features } = wallet;

    return Object.entries(features).some(([featureName]) =>
      featureName.startsWith("sui:"),
    );
  };

  for (const wallet of api.get()) {
    if (supportsSui(wallet)) {
      deriveAndRegisterWallet(wallet);
    }
  }

  const offRegister = api.on("register", (wallet) => {
    if (supportsSui(wallet)) {
      deriveAndRegisterWallet(wallet);
    }
  });

  const offUnregister = api.on("unregister", (wallet) => {
    if (supportsSui(wallet)) {
      const unregisterWallet = registrations[wallet.name];
      if (unregisterWallet) {
        unregisterWallet();
        delete registrations[wallet.name];
      }
    }
  });

  return () => {
    offRegister();
    offUnregister();
    for (const unregisterWallet of Object.values(registrations)) {
      unregisterWallet();
    }
  };
}
