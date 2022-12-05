import { useWallet } from "@aptos-labs/wallet-adapter-react";

const WalletButtons = () => {
  const { wallets, connect } = useWallet();

  return (
    <>
      {wallets.map((wallet) => (
        <button
          className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${
            wallet.readyState !== "Installed"
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          disabled={wallet.readyState !== "Installed"}
          key={wallet.name}
          onClick={() => connect(wallet.name)}
        >
          <>{wallet.name}</>
        </button>
      ))}
    </>
  );
};
export default WalletButtons;
