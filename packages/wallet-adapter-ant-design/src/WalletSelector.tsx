import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CopyOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import {
  AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  AdapterNotDetectedWallet,
  AdapterWallet,
  AptosPrivacyPolicy,
  WalletItem,
  WalletSortingOptions,
  groupAndSortWallets,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  Button,
  Collapse,
  Divider,
  Dropdown,
  Flex,
  MenuProps,
  Modal,
  ModalProps,
  Typography,
  message,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./styles.css";

const { Text } = Typography;

interface WalletSelectorProps extends WalletSortingOptions {
  isModalOpen?: boolean;
  setModalOpen?: Dispatch<SetStateAction<boolean>>;
}

export function WalletSelector({
  isModalOpen,
  setModalOpen,
  ...walletSortingOptions
}: WalletSelectorProps) {
  const [walletSelectorModalOpen, setWalletSelectorModalOpen] = useState(false);

  useEffect(() => {
    // If the component is being used as a controlled component,
    // sync the external and internal modal state.
    if (isModalOpen !== undefined) {
      setWalletSelectorModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  const {
    account,
    connected,
    disconnect,
    wallets = [],
    notDetectedWallets = [],
  } = useWallet();

  const { aptosConnectWallets, availableWallets, installableWallets } =
    groupAndSortWallets(
      [...wallets, ...notDetectedWallets],
      walletSortingOptions
    );

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  const onWalletButtonClick = () => {
    if (connected) {
      disconnect();
    } else {
      setWalletSelectorModalOpen(true);
    }
  };

  const handleCopyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address.toString());
      message.success("Address copied to clipboard");
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "copy",
      label: "Copy Address",
      icon: <CopyOutlined />,
      onClick: handleCopyAddress,
    },
    {
      key: "disconnect",
      label: "Disconnect",
      icon: <DisconnectOutlined />,
      onClick: handleDisconnect,
    },
  ];

  const closeModal = () => {
    setWalletSelectorModalOpen(false);
    if (setModalOpen) {
      setModalOpen(false);
    }
  };

  const buttonText =
    account?.ansName ||
    truncateAddress(account?.address?.toString()) ||
    "Unknown";

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
      {connected ? (
        <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
          <Button className="wallet-button">{buttonText}</Button>
        </Dropdown>
      ) : (
        <Button className="wallet-button" onClick={onWalletButtonClick}>
          Connect Wallet
        </Button>
      )}
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
                {availableWallets.map((wallet) => (
                  <WalletRow
                    key={wallet.name}
                    wallet={wallet}
                    onConnect={closeModal}
                  />
                ))}
              </Flex>
              {!!installableWallets.length && (
                <Collapse
                  ghost
                  expandIconPosition="end"
                  items={[
                    {
                      key: "more-wallets",
                      label: "More Wallets",
                      children: (
                        <Flex vertical gap={12}>
                          {installableWallets.map((wallet) => (
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
  wallet: AdapterWallet | AdapterNotDetectedWallet;
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
