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
var _AppReadyEvent_detail;
let wallets = undefined;
const registeredWalletsSet = new Set();
function addRegisteredWallet(wallet) {
    cachedWalletsArray = undefined;
    registeredWalletsSet.add(wallet);
}
function removeRegisteredWallet(wallet) {
    cachedWalletsArray = undefined;
    registeredWalletsSet.delete(wallet);
}
const listeners = {};
/**
 * Get an API for {@link Wallets.get | getting}, {@link Wallets.on | listening for}, and
 * {@link Wallets.register | registering} {@link "@wallet-standard/base".Wallet | Wallets}.
 *
 * When called for the first time --
 *
 * This dispatches a {@link "@wallet-standard/base".WindowAppReadyEvent} to notify each Wallet that the app is ready
 * to register it.
 *
 * This also adds a listener for {@link "@wallet-standard/base".WindowRegisterWalletEvent} to listen for a notification
 * from each Wallet that the Wallet is ready to be registered by the app.
 *
 * This combination of event dispatch and listener guarantees that each Wallet will be registered synchronously as soon
 * as the app is ready whether the app loads before or after each Wallet.
 *
 * @return API for getting, listening for, and registering Wallets.
 *
 * @group App
 */
export function getWallets() {
    if (wallets)
        return wallets;
    wallets = Object.freeze({ register, get, on });
    if (typeof window === 'undefined')
        return wallets;
    const api = Object.freeze({ register });
    try {
        window.addEventListener('wallet-standard:register-wallet', ({ detail: callback }) => callback(api));
    }
    catch (error) {
        console.error('wallet-standard:register-wallet event listener could not be added\n', error);
    }
    try {
        window.dispatchEvent(new AppReadyEvent(api));
    }
    catch (error) {
        console.error('wallet-standard:app-ready event could not be dispatched\n', error);
    }
    return wallets;
}
function register(...wallets) {
    // Filter out wallets that have already been registered.
    // This prevents the same wallet from being registered twice, but it also prevents wallets from being
    // unregistered by reusing a reference to the wallet to obtain the unregister function for it.
    wallets = wallets.filter((wallet) => !registeredWalletsSet.has(wallet));
    // If there are no new wallets to register, just return a no-op unregister function.
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!wallets.length)
        return () => { };
    wallets.forEach((wallet) => addRegisteredWallet(wallet));
    listeners['register']?.forEach((listener) => guard(() => listener(...wallets)));
    // Return a function that unregisters the registered wallets.
    return function unregister() {
        wallets.forEach((wallet) => removeRegisteredWallet(wallet));
        listeners['unregister']?.forEach((listener) => guard(() => listener(...wallets)));
    };
}
let cachedWalletsArray;
function get() {
    if (!cachedWalletsArray) {
        cachedWalletsArray = [...registeredWalletsSet];
    }
    return cachedWalletsArray;
}
function on(event, listener) {
    listeners[event]?.push(listener) || (listeners[event] = [listener]);
    // Return a function that removes the event listener.
    return function off() {
        listeners[event] = listeners[event]?.filter((existingListener) => listener !== existingListener);
    };
}
function guard(callback) {
    try {
        callback();
    }
    catch (error) {
        console.error(error);
    }
}
class AppReadyEvent extends Event {
    get detail() {
        return __classPrivateFieldGet(this, _AppReadyEvent_detail, "f");
    }
    get type() {
        return 'wallet-standard:app-ready';
    }
    constructor(api) {
        super('wallet-standard:app-ready', {
            bubbles: false,
            cancelable: false,
            composed: false,
        });
        _AppReadyEvent_detail.set(this, void 0);
        __classPrivateFieldSet(this, _AppReadyEvent_detail, api, "f");
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
_AppReadyEvent_detail = new WeakMap();
/**
 * @deprecated Use {@link getWallets} instead.
 *
 * @group Deprecated
 */
export function DEPRECATED_getWallets() {
    if (wallets)
        return wallets;
    wallets = getWallets();
    if (typeof window === 'undefined')
        return wallets;
    const callbacks = window.navigator.wallets || [];
    if (!Array.isArray(callbacks)) {
        console.error('window.navigator.wallets is not an array');
        return wallets;
    }
    const { register } = wallets;
    const push = (...callbacks) => callbacks.forEach((callback) => guard(() => callback({ register })));
    try {
        Object.defineProperty(window.navigator, 'wallets', {
            value: Object.freeze({ push }),
        });
    }
    catch (error) {
        console.error('window.navigator.wallets could not be set');
        return wallets;
    }
    push(...callbacks);
    return wallets;
}
//# sourceMappingURL=wallets.js.map