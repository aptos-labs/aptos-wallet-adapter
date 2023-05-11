import { useWallet, WalletReadyState } from "@aptos-labs/wallet-adapter-react";

const WalletButtons = () => {
  const { wallets, connect } = useWallet();

  return (
    <>
      {wallets.map((wallet) => {
        const isWalletReady = wallet.readyState === WalletReadyState.Installed || wallet.readyState === WalletReadyState.Loadable
        return (
          <button
            className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${isWalletReady ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"}`}
            disabled={!isWalletReady}
            key={wallet.name}
            onClick={() => connect(wallet.name)}
          >
            <>{wallet.name}</>
          </button>
        )
      })}
    </>
  );
};
export default WalletButtons;
