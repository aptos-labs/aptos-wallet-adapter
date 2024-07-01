import {
  AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  AnyAptosWallet,
  AptosPrivacyPolicy,
  WalletItem,
  getAptosConnectWallets,
  isInstallRequired,
  partitionWallets,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  Button,
  Collapse,
  Divider,
  Flex,
  Modal,
  ModalProps,
  Typography,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./styles.css";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

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

  const modalProps: ModalProps = {
    centered: true,
    open: walletSelectorModalOpen,
    onCancel: closeModal,
    footer: null,
    zIndex: 9999,
    className: "wallet-selector-modal",
  };

  const renderEducationScreens = (screen: AboutAptosConnectEducationScreen) => (
    <Modal
      {...modalProps}
      afterClose={screen.cancel}
      title={
        <div className="about-aptos-connect-header">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={screen.cancel}
          />
          <div className="wallet-modal-title">About Aptos Connect</div>
        </div>
      }
    >
      <div className="about-aptos-connect-graphic-wrapper">
        <screen.Graphic />
      </div>
      <div className="about-aptos-connect-text-wrapper">
        <screen.Title className="about-aptos-connect-title" />
        <screen.Description className="about-aptos-connect-description" />
      </div>
      <div className="about-aptos-connect-footer-wrapper">
        <Button
          type="text"
          style={{ justifySelf: "start" }}
          onClick={screen.back}
        >
          Back
        </Button>
        <div className="about-aptos-connect-screen-indicators-wrapper">
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <ScreenIndicator
              key={i}
              className="about-aptos-connect-screen-indicator"
            >
              <div />
            </ScreenIndicator>
          ))}
        </div>
        <Button
          type="text"
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          style={{ justifySelf: "end" }}
          onClick={screen.next}
        >
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </Modal>
  );

  return (
    <>
      <Button className="wallet-button" onClick={onWalletButtonClick}>
        {connected ? buttonText : "Connect Wallet"}
      </Button>
      <AboutAptosConnect renderEducationScreen={renderEducationScreens}>
        <Modal
          {...modalProps}
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
        >
          {!connected && (
            <>
              {hasAptosConnectWallets && (
                <Flex vertical gap={12}>
                  {aptosConnectWallets.map((wallet) => (
                    <AptosConnectWalletRow
                      key={wallet.name}
                      wallet={wallet}
                      onConnect={closeModal}
                    />
                  ))}
                  <p className="about-aptos-connect-trigger-wrapper">
                    Learn more about{" "}
                    <AboutAptosConnect.Trigger className="about-aptos-connect-trigger">
                      Aptos Connect
                      <ArrowRightOutlined />
                    </AboutAptosConnect.Trigger>
                  </p>
                  <AptosPrivacyPolicy className="aptos-connect-privacy-policy-wrapper">
                    <p className="aptos-connect-privacy-policy-text">
                      <AptosPrivacyPolicy.Disclaimer />{" "}
                      <AptosPrivacyPolicy.Link className="aptos-connect-privacy-policy-link" />
                      <span>.</span>
                    </p>
                    <AptosPrivacyPolicy.PoweredBy className="aptos-connect-powered-by" />
                  </AptosPrivacyPolicy>
                  <Divider>Or</Divider>
                </Flex>
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
      </AboutAptosConnect>
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
