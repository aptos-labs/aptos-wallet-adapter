import { WalletReadyState } from '@aptos-labs/wallet-adapter-core';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { truncateAddress } from './utils';

export function WalletDropdown() {
  const {
    connect,
    disconnect,
    account,
    wallets,
    connected,
  } = useWallet();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-opacity-80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {account?.address || account?.publicKey
            ? truncateAddress(account.address)
            : 'Connect Wallet'}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items style={{ zIndex: 1 }} className="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden
          group-[.disconnected]:-right-[22px] group-[.disconnected]:origin-top max-md:-right-[22px] max-md:origin-top">
          {!connected &&
            wallets.map((wallet) => {
              if (wallet.readyState === WalletReadyState.Installed) {
                return (
                  <div key={wallet.name}>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'btn-secondary text-black bg-black bg-opacity-5'
                              : 'text-gray-900'
                          } group flex w-full font-medium items-center group-[.disconnected]:justify-center px-3 py-2 text-sm`}
                          onClick={() => {
                            connect(wallet.name);
                          }}
                        >
                          <>
                            <img src={wallet.icon} width={25} style={{ marginRight: 10 }}/>
                            {wallet.name}
                          </>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                );
              } else if (wallet.readyState === WalletReadyState.NotDetected) {
                return (
                  <div key={wallet.name}>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'btn-secondary text-black bg-black bg-opacity-5'
                              : 'text-gray-900'
                          } group flex w-full font-medium flex-around items-stretch group-[.disconnected]:justify-center px-3 py-2 text-sm`}
                          onClick={() => {
                            window.open(wallet.url)
                          }}
                        >
                            <img src={wallet.icon} width={25} style={{ marginRight: 10 }}/>
                            <div>
                              {wallet.name}
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                              {"Install"}
                            </div>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                );
              }
            })}
          {connected && (
            <div key={'disconnect'}>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? 'btn-secondary text-black bg-black bg-opacity-5'
                        : 'text-gray-900'
                    } group flex w-full font-medium items-center px-3 py-2 text-sm`}
                    onClick={() => {
                      disconnect();
                    }}
                  >
                    Disconnect
                  </button>
                )}
              </Menu.Item>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
