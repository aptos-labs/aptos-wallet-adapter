---
"@aptos-labs/wallet-adapter-core": major
"@aptos-labs/wallet-adapter-react": major
"@aptos-labs/wallet-adapter-ant-design": major
"@aptos-labs/wallet-adapter-mui-design": major
---

Drop Aptos Connect and Identity Connect entirely. The built-in Petra Web wallets ("Continue with Google", "Continue with Apple" and "Petra Web") now come from `@petra-app/wallet-adapter-plugin`, replacing `@aptos-connect/wallet-adapter-plugin`. The adapter no longer installs any `@aptos-connect/*`, `@identity-connect/*` or `@telegram-apps/*` package. It still installs the wallets itself: dapps do not need to register the plugin.

**Migration**

- Rename `dappConfig.aptosConnect` to `dappConfig.petraWeb`. It accepts `claimSecretKey`, `dappName`, `dappImageURI`, `frontendBaseURL` and `aptosClientConfig`.
- Remove `dappConfig.aptosConnectDappId` and the nested `dappId`, `preferredWalletName`, `backendBaseURL` and `tgWebAppURL` options. Paired accounts and the Telegram mini-app transport are no longer supported.
- `@aptos-labs/ts-sdk` `^7.5.0` is now the minimum peer version.
- Petra Web sessions created by earlier versions are not carried over. Each user reconnects once per dapp origin and browser profile. With `autoConnect` set to `true`, the React provider forgets the remembered Petra Web wallet instead of opening a popup, and the user reconnects with a click. A function-valued `autoConnect` still decides for itself.
- A Petra Web wallet that a dapp registers with the Wallet Standard before creating the adapter takes precedence over the built-in wallet of the same name.
- The deprecated `AptosConnect`-named exports are removed. Replace `isAptosConnectWallet` with `isPetraWebWallet`, `getAptosConnectWallets` with `getPetraWebWallets`, `AboutAptosConnect` (and its `AboutAptosConnectEducationScreen` and `AboutAptosConnectProps` types) with `AboutPetraWeb`, `APTOS_CONNECT_BASE_URL` with `PETRA_WEB_BASE_URL`, and `APTOS_CONNECT_ACCOUNT_URL` with `PETRA_WEB_ACCOUNT_URL`.
- `groupAndSortWallets` no longer returns `aptosConnectWallets` or accepts `sortAptosConnectWallets`; use `petraWebWallets` and `sortPetraWebWallets`. This also applies to the sorting props of the Ant Design and MUI selectors.
- `isPetraWebWallet` no longer matches wallets whose URL starts with `https://aptosconnect.app`.
- Ant Design selector: the `aptos-connect-*` and `about-aptos-connect-*` CSS classes are renamed to `petra-web-*` and `about-petra-web-*`. Update any style overrides.
