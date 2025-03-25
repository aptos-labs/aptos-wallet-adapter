export declare class WalletError extends Error {
    error: any;
    constructor(message?: string, error?: any);
}
export declare class WalletNotSelectedError extends WalletError {
    name: string;
}
export declare class WalletNotReadyError extends WalletError {
    name: string;
}
export declare class WalletLoadError extends WalletError {
    name: string;
}
export declare class WalletConfigError extends WalletError {
    name: string;
}
export declare class WalletConnectionError extends WalletError {
    name: string;
}
export declare class WalletDisconnectedError extends WalletError {
    name: string;
}
export declare class WalletDisconnectionError extends WalletError {
    name: string;
}
export declare class WalletAccountError extends WalletError {
    name: string;
}
export declare class WalletGetNetworkError extends WalletError {
    name: string;
}
export declare class WalletAccountChangeError extends WalletError {
    name: string;
}
export declare class WalletNetworkChangeError extends WalletError {
    name: string;
}
export declare class WalletPublicKeyError extends WalletError {
    name: string;
}
export declare class WalletKeypairError extends WalletError {
    name: string;
}
export declare class WalletNotConnectedError extends WalletError {
    name: string;
}
export declare class WalletSendTransactionError extends WalletError {
    name: string;
}
export declare class WalletSignMessageError extends WalletError {
    name: string;
}
export declare class WalletSubmitTransactionError extends WalletError {
    name: string;
}
export declare class WalletSignMessageAndVerifyError extends WalletError {
    name: string;
}
export declare class WalletSignAndSubmitMessageError extends WalletError {
    name: string;
}
export declare class WalletSignTransactionError extends WalletError {
    name: string;
}
export declare class WalletTimeoutError extends WalletError {
    name: string;
}
export declare class WalletWindowBlockedError extends WalletError {
    name: string;
}
export declare class WalletWindowClosedError extends WalletError {
    name: string;
}
export declare class WalletResponseError extends WalletError {
    name: string;
}
export declare class WalletNotSupportedMethod extends WalletError {
    name: string;
}
export declare class WalletChangeNetworkError extends WalletError {
    name: string;
}
//# sourceMappingURL=index.d.ts.map