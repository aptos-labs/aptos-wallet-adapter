import {
  useWallet,
  WalletReadyState,
  Wallet,
  isRedirectable,
} from "@aptos-labs/wallet-adapter-react";

const WalletButtons = () => {
  const { wallets, connect } = useWallet();

  return (
    <>
      {wallets.map((wallet: Wallet) => {
        const isWalletReady =
          wallet.readyState === WalletReadyState.Installed ||
          wallet.readyState === WalletReadyState.Loadable;
        /**
         * If we are on a mobile browser, adapter checks whether a wallet has a `deeplinkProvider` property
         * a. If it does, on connect it should redirect the user to the app by using the wallet's depplink url
         * b. If it does not, up to the dapp to choose on the UI, but can simply disable the button
         * c. If we are already in a in-app browser, we dont want to redirect anywhere, so connect should work as expected in the mobile app.
         *
         * !isWalletReady - ignore installed/sdk wallets that dont rely on window injection
         * isRedirectable() - are we on mobile AND not in an in-app browser
         * !wallet.deeplinkProvider - does wallet have deeplinkProvider property? i.e does it support a mobile app
         */
        return !isWalletReady &&
          isRedirectable() &&
          !wallet.deeplinkProvider ? (
          <button
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded mr-4 opacity-50 cursor-not-allowed`}
            disabled={true}
            key={wallet.name}
          >
            <>{wallet.name} - Desktop Only</>
          </button>
        ) : (
          // If we are on a desktop view, wallet connect should work as it is now for any wallet type (extension,sdk,etc)
          <button
            className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${
              isWalletReady
                ? "hover:bg-blue-700"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isWalletReady}
            key={wallet.name}
            onClick={() => connect(wallet.name)}
          >
            <>{wallet.name}</>
          </button>
        );
      })}
    </>
  );
};
export default WalletButtons;
