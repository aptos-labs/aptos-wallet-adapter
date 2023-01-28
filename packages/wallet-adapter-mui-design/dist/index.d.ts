declare type WalletConnectorProps = {
    networkSupport?: string;
    handleNavigate?: () => void;
};
declare function WalletConnector({ networkSupport, handleNavigate, }: WalletConnectorProps): JSX.Element;

export { WalletConnector as default };
