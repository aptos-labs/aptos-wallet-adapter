import {
  useWallet,
  WalletReadyState,
  Wallet,
  isRedirectable,
} from "@aptos-labs/wallet-adapter-react";

const WalletButtons = () => {
  const { wallets } = useWallet();

  return (
    <>
      {wallets.map((wallet: Wallet) => {
        return walletView(wallet);
      })}
    </>
  );
};

const walletView = (wallet: Wallet) => {
  const { connect } = useWallet();
  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;
  const mobileSupport = wallet.deeplinkProvider;
  /**
   * If we are on a mobile browser, adapter checks whether a wallet has a `deeplinkProvider` property
   * a. If it does, on connect it should redirect the user to the app by using the wallet's deeplink url
   * b. If it does not, up to the dapp to choose on the UI, but can simply disable the button
   * c. If we are already in a in-app browser, we dont want to redirect anywhere, so connect should work as expected in the mobile app.
   *
   * !isWalletReady - ignore installed/sdk wallets that dont rely on window injection
   * isRedirectable() - are we on mobile AND not in an in-app browser
   * mobileSupport - does wallet have deeplinkProvider property? i.e does it support a mobile app
   */
  if (!isWalletReady && isRedirectable()) {
    // wallet has mobile app
    if (mobileSupport) {
      return (
        <button
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded mr-4 hover:bg-blue-700`}
          disabled={false}
          key={wallet.name}
        >
          <>{wallet.name}</>
        </button>
      );
    }
    // wallet does not have mobile app
    return (
      <button
        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded mr-4 opacity-50 cursor-not-allowed`}
        disabled={true}
        key={wallet.name}
      >
        <>{wallet.name} - Desktop Only</>
      </button>
    );
  } else {
    // we are on desktop view
    return (
      <button
        className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${
          isWalletReady ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!isWalletReady}
        key={wallet.name}
        onClick={() => connect(wallet.name)}
      >
        <>{wallet.name}</>
      </button>
    );
  }
};
export default WalletButtons;
