var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _RegisterWalletEvent_detail;
/**
 * Register a {@link "@wallet-standard/base".Wallet} as a Standard Wallet with the app.
 *
 * This dispatches a {@link "@wallet-standard/base".WindowRegisterWalletEvent} to notify the app that the Wallet is
 * ready to be registered.
 *
 * This also adds a listener for {@link "@wallet-standard/base".WindowAppReadyEvent} to listen for a notification from
 * the app that the app is ready to register the Wallet.
 *
 * This combination of event dispatch and listener guarantees that the Wallet will be registered synchronously as soon
 * as the app is ready whether the Wallet loads before or after the app.
 *
 * @param wallet Wallet to register.
 *
 * @group Wallet
 */
export function registerWallet(wallet) {
    const callback = ({ register }) => register(wallet);
    try {
        window.dispatchEvent(new RegisterWalletEvent(callback));
    }
    catch (error) {
        console.error('wallet-standard:register-wallet event could not be dispatched\n', error);
    }
    try {
        window.addEventListener('wallet-standard:app-ready', ({ detail: api }) => callback(api));
    }
    catch (error) {
        console.error('wallet-standard:app-ready event listener could not be added\n', error);
    }
}
class RegisterWalletEvent extends Event {
    get detail() {
        return __classPrivateFieldGet(this, _RegisterWalletEvent_detail, "f");
    }
    get type() {
        return 'wallet-standard:register-wallet';
    }
    constructor(callback) {
        super('wallet-standard:register-wallet', {
            bubbles: false,
            cancelable: false,
            composed: false,
        });
        _RegisterWalletEvent_detail.set(this, void 0);
        __classPrivateFieldSet(this, _RegisterWalletEvent_detail, callback, "f");
    }
    /** @deprecated */
    preventDefault() {
        throw new Error('preventDefault cannot be called');
    }
    /** @deprecated */
    stopImmediatePropagation() {
        throw new Error('stopImmediatePropagation cannot be called');
    }
    /** @deprecated */
    stopPropagation() {
        throw new Error('stopPropagation cannot be called');
    }
}
_RegisterWalletEvent_detail = new WeakMap();
/**
 * @deprecated Use {@link registerWallet} instead.
 *
 * @group Deprecated
 */
export function DEPRECATED_registerWallet(wallet) {
    var _a;
    registerWallet(wallet);
    try {
        ((_a = window.navigator).wallets || (_a.wallets = [])).push(({ register }) => register(wallet));
    }
    catch (error) {
        console.error('window.navigator.wallets could not be pushed\n', error);
    }
}
//# sourceMappingURL=register.js.map