import React, { useState } from "react";
import { Button, Menu, Modal, Typography } from "antd";
import {
  useWallet,
  WalletName,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-react";
import "./styles.css";
import { truncateAddress } from "./utils";
const { Text } = Typography;

export function WalletSelector() {
  const [walletSelectorModalOpen, setWalletSelectorModalOpen] = useState(false);
  const { connect, disconnect, account, wallets, connected } = useWallet();

  const onWalletButtonClick = () => {
    if (connected) {
      disconnect();
    } else {
      setWalletSelectorModalOpen(true);
    }
  };

  const onWalletSelected = (wallet: WalletName) => {
    connect(wallet);
    setWalletSelectorModalOpen(false);
  };

  return (
    <>
      <Button className="wallet-button" onClick={() => onWalletButtonClick()}>
        {connected ? truncateAddress(account?.address) : "Connect Wallet"}
      </Button>
      <Modal
        title={<div className="wallet-modal-title">Connect Wallet</div>}
        centered
        open={walletSelectorModalOpen}
        onCancel={() => setWalletSelectorModalOpen(false)}
        footer={[]}
        closable={false}
      >
        {!connected && (
          <Menu>
            {wallets.map((wallet) => {
              return (
                <Menu.Item
                  key={wallet.name}
                  onClick={
                    wallet.readyState === WalletReadyState.Installed || wallet.readyState === WalletReadyState.Loadable
                      ? () => onWalletSelected(wallet.name)
                      : () => window.open(wallet.url)
                  }
                >
                  <div className="wallet-menu-wrapper">
                    <div className="wallet-name-wrapper">
                      <img
                        src={wallet.icon}
                        width={25}
                        style={{ marginRight: 10 }}
                      />
                      <Text className="wallet-selector-text">
                        {wallet.name}
                      </Text>
                    </div>
                    {wallet.readyState === WalletReadyState.Installed || wallet.readyState === WalletReadyState.Loadable ? (
                      <Button className="wallet-connect-button">
                        <Text className="wallet-connect-button-text">
                          Connect
                        </Text>
                      </Button>
                    ) : (
                      <Text className="wallet-connect-install">Install</Text>
                    )}
                  </div>
                </Menu.Item>
              );
            })}
          </Menu>
        )}
      </Modal>
    </>
  );
}
