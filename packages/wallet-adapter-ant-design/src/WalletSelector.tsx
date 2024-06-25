import {
  AnyAptosWallet,
  WalletItem,
  getAptosConnectWallets,
  isInstallRequired,
  partitionWallets,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Button, Collapse, Divider, Flex, Modal, Typography } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./styles.css";

const { Text } = Typography;

type WalletSelectorProps = {
  isModalOpen?: boolean;
  setModalOpen?: Dispatch<SetStateAction<boolean>>;
  /**
   * An optional function for sorting wallets that are currently installed or
   * loadable in the wallet selector modal.
   */
  sortDefaultWallets?: (a: AnyAptosWallet, b: AnyAptosWallet) => number;
  /**
   * An optional function for sorting wallets that are NOT currently installed or
   * loadable in the wallet selector modal.
   */
  sortMoreWallets?: (a: AnyAptosWallet, b: AnyAptosWallet) => number;
};

export function WalletSelector({
  isModalOpen,
  setModalOpen,
  sortDefaultWallets,
  sortMoreWallets,
}: WalletSelectorProps) {
  const [walletSelectorModalOpen, setWalletSelectorModalOpen] = useState(false);

  useEffect(() => {
    // If the component is being used as a controlled component,
    // sync the external and internal modal state.
    if (isModalOpen !== undefined) {
      setWalletSelectorModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  const { account, connected, disconnect, wallets = [] } = useWallet();

  const {
    /** Wallets that use social login to create an account on the blockchain */
    aptosConnectWallets,
    /** Wallets that use traditional wallet extensions */
    otherWallets,
  } = getAptosConnectWallets(wallets);

  const {
    /** Wallets that are currently installed or loadable. */
    defaultWallets,
    /** Wallets that are NOT currently installed or loadable. */
    moreWallets,
  } = partitionWallets(otherWallets);

  if (sortDefaultWallets) defaultWallets.sort(sortDefaultWallets);
  if (sortMoreWallets) moreWallets.sort(sortMoreWallets);

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  const onWalletButtonClick = () => {
    if (connected) {
      disconnect();
    } else {
      setWalletSelectorModalOpen(true);
    }
  };

  const closeModal = () => {
    setWalletSelectorModalOpen(false);
    if (setModalOpen) {
      setModalOpen(false);
    }
  };

  const buttonText =
    account?.ansName || truncateAddress(account?.address) || "Unknown";

  return (
    <>
      <Button className="wallet-button" onClick={onWalletButtonClick}>
        {connected ? buttonText : "Connect Wallet"}
      </Button>
      <Modal
        title={
          <div className="wallet-modal-title">
            {hasAptosConnectWallets ? (
              <>
                <span>Log in or sign up</span>
                <span>with Social + Aptos Connect</span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </div>
        }
        centered
        open={walletSelectorModalOpen}
        onCancel={closeModal}
        footer={[]}
        closable={false}
        zIndex={9999}
        className="wallet-selector-modal"
      >
        {!connected && (
          <>
            {hasAptosConnectWallets && (
              <>
                <Flex vertical gap={12}>
                  {aptosConnectWallets.map((wallet) => (
                    <AptosConnectWalletRow
                      key={wallet.name}
                      wallet={wallet}
                      onConnect={closeModal}
                    />
                  ))}
                </Flex>
                <Divider>Or</Divider>
              </>
            )}
            <Flex vertical gap={12}>
              {defaultWallets.map((wallet) => (
                <WalletRow
                  key={wallet.name}
                  wallet={wallet}
                  onConnect={closeModal}
                />
              ))}
            </Flex>
            {!!moreWallets.length && (
              <Collapse
                ghost
                expandIconPosition="end"
                items={[
                  {
                    key: "more-wallets",
                    label: "More Wallets",
                    children: (
                      <Flex vertical gap={12}>
                        {moreWallets.map((wallet) => (
                          <WalletRow
                            key={wallet.name}
                            wallet={wallet}
                            onConnect={closeModal}
                          />
                        ))}
                      </Flex>
                    ),
                  },
                ]}
              />
            )}
          </>
        )}
      </Modal>
    </>
  );
}

interface WalletRowProps {
  wallet: AnyAptosWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect} asChild>
      <div className="wallet-menu-wrapper">
        <div className="wallet-name-wrapper">
          <WalletItem.Icon className="wallet-selector-icon" />
          <WalletItem.Name asChild>
            <Text className="wallet-selector-text">{wallet.name}</Text>
          </WalletItem.Name>
        </div>
        {isInstallRequired(wallet) ? (
          <WalletItem.InstallLink className="wallet-connect-install" />
        ) : (
          <WalletItem.ConnectButton asChild>
            <Button className="wallet-connect-button">Connect</Button>
          </WalletItem.ConnectButton>
        )}
      </div>
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect} asChild>
      <WalletItem.ConnectButton asChild>
        <Button size="large" className="aptos-connect-button">
          <WalletItem.Icon className="wallet-selector-icon" />
          <WalletItem.Name />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}
