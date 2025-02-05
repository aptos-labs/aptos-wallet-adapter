import { UserResponseStatus } from '@aptos-labs/wallet-standard';
import { useState } from 'react';
import { useActiveWallet, UseActiveWalletConnectedResult } from './useActiveWallet';
import { setActiveWalletId } from './useActiveWalletId';
import { useAvailableWallets } from './useAvailableWallets';

type Wallet = ReturnType<typeof useAvailableWallets>[0];

export function WalletSelector() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const onToggle = () => {
    setIsModalOpen((prev) => !prev);
  };
  return (
    <div>
      <button onClick={onToggle}>Connect</button>
      {isModalOpen ? <WalletSelectorModal /> : null}
    </div>
  );
}

export function WalletSelectorModal() {
  const wallets = useAvailableWallets();

  const onConnect = async (wallet: Wallet) => {
    const response = await wallet.connect();
    if (response.status === UserResponseStatus.APPROVED) {
      setActiveWalletId(wallet.name);
    }
  };

  return (
    <div>
      {wallets.map((wallet) => (
        <button key={wallet.name} onClick={() => onConnect(wallet)}>
          {wallet.icon} {wallet.name}
        </button>
      ))}
    </div>
  );
}

interface ActiveAccountNavItemProps {
  wallet: UseActiveWalletConnectedResult
}

export function ActiveAccountNavItem({ wallet }: ActiveAccountNavItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const onDisconnect = async () => {
    await wallet.disconnect();
  };

  return (
    <button onClick={onToggle}>
      <div>{wallet.account.address.toString()}</div>
      {isDropdownOpen ? (
        <ul>
          <li>Copy address</li>
          <li onClick={onDisconnect}>Disconnect</li>
        </ul>
      ) : null}
    </button>
  )
}


function Navbar() {
  const wallet = useActiveWallet();
  return (
    <nav>
      <div>Logo</div>
      {wallet.isConnected ? <ActiveAccountNavItem wallet={wallet} /> : <WalletSelector />}
    </nav>
  );
}

function Body() {
  const wallet = useActiveWallet();

  const onSign = async () => {
    if (!wallet.isConnected) {
      return;
    }
    const response = await wallet.signTransaction({} as any);
  };

  return wallet.isConnected ? <button onClick={onSign}>Sign message</button> :
    <div>Please connect to wallet first</div>;
}
