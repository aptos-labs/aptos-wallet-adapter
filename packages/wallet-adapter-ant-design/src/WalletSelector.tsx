import React, { useState } from "react";
import { Button, Modal } from "antd";
import {
  useWallet,
  WalletName,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-react";
import { truncateAddress } from "./utils";

export function WalletSelector() {
  const [modal2Open, setModal2Open] = useState(false);
  const { connect, disconnect, account, wallets, connected } = useWallet();

  const onWalletButtonClick = () => {
    if (connected) {
      disconnect();
    } else {
      setModal2Open(true);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => onWalletButtonClick()}>
        {connected ? truncateAddress(account?.address) : "Connect Wallet"}
      </Button>
      <Modal
        title={
          <div style={{ textAlign: "center", fontSize: "1.5rem" }}>
            <span>Connect Wallet</span>
          </div>
        }
        centered
        open={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={[]}
        closable={false}
      >
        {!connected &&
          wallets.map((wallet) => {
            if (wallet.readyState === WalletReadyState.Installed) {
              return (
                <div key={wallet.name}>
                  {/* <button
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
                        </button> */}
                  <Button
                    block
                    onClick={() => {
                      connect(wallet.name);
                    }}
                  >
                    <>
                      <img
                        src={wallet.icon}
                        width={25}
                        style={{ marginRight: 10 }}
                      />
                      {wallet.name}
                    </>
                  </Button>
                </div>
              );
            } else if (wallet.readyState === WalletReadyState.NotDetected) {
              return (
                <div key={wallet.name}>
                  <Button
                    block
                    onClick={() => {
                      window.open(wallet.url);
                    }}
                  >
                    <img
                      src={wallet.icon}
                      width={25}
                      style={{ marginRight: 10 }}
                    />
                    <div>{wallet.name}</div>
                    <div style={{ marginLeft: "auto" }}>{"Install"}</div>
                  </Button>
                </div>
              );
            }
          })}
      </Modal>
    </>
  );
}
