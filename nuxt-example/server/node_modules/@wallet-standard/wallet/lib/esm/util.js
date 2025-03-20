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
var _ReadonlyWalletAccount_address, _ReadonlyWalletAccount_publicKey, _ReadonlyWalletAccount_chains, _ReadonlyWalletAccount_features, _ReadonlyWalletAccount_label, _ReadonlyWalletAccount_icon;
/**
 * Base implementation of a {@link "@wallet-standard/base".WalletAccount} to be used or extended by a
 * {@link "@wallet-standard/base".Wallet}.
 *
 * `WalletAccount` properties must be read-only. This class enforces this by making all properties
 * [truly private](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) and
 * read-only, using getters for access, returning copies instead of references, and calling
 * [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
 * on the instance.
 *
 * @group Account
 */
export class ReadonlyWalletAccount {
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.address | WalletAccount::address} */
    get address() {
        return __classPrivateFieldGet(this, _ReadonlyWalletAccount_address, "f");
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.publicKey | WalletAccount::publicKey} */
    get publicKey() {
        return __classPrivateFieldGet(this, _ReadonlyWalletAccount_publicKey, "f").slice();
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.chains | WalletAccount::chains} */
    get chains() {
        return __classPrivateFieldGet(this, _ReadonlyWalletAccount_chains, "f").slice();
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.features | WalletAccount::features} */
    get features() {
        return __classPrivateFieldGet(this, _ReadonlyWalletAccount_features, "f").slice();
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.label | WalletAccount::label} */
    get label() {
        return __classPrivateFieldGet(this, _ReadonlyWalletAccount_label, "f");
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.icon | WalletAccount::icon} */
    get icon() {
        return __classPrivateFieldGet(this, _ReadonlyWalletAccount_icon, "f");
    }
    /**
     * Create and freeze a read-only account.
     *
     * @param account Account to copy properties from.
     */
    constructor(account) {
        _ReadonlyWalletAccount_address.set(this, void 0);
        _ReadonlyWalletAccount_publicKey.set(this, void 0);
        _ReadonlyWalletAccount_chains.set(this, void 0);
        _ReadonlyWalletAccount_features.set(this, void 0);
        _ReadonlyWalletAccount_label.set(this, void 0);
        _ReadonlyWalletAccount_icon.set(this, void 0);
        if (new.target === ReadonlyWalletAccount) {
            Object.freeze(this);
        }
        __classPrivateFieldSet(this, _ReadonlyWalletAccount_address, account.address, "f");
        __classPrivateFieldSet(this, _ReadonlyWalletAccount_publicKey, account.publicKey.slice(), "f");
        __classPrivateFieldSet(this, _ReadonlyWalletAccount_chains, account.chains.slice(), "f");
        __classPrivateFieldSet(this, _ReadonlyWalletAccount_features, account.features.slice(), "f");
        __classPrivateFieldSet(this, _ReadonlyWalletAccount_label, account.label, "f");
        __classPrivateFieldSet(this, _ReadonlyWalletAccount_icon, account.icon, "f");
    }
}
_ReadonlyWalletAccount_address = new WeakMap(), _ReadonlyWalletAccount_publicKey = new WeakMap(), _ReadonlyWalletAccount_chains = new WeakMap(), _ReadonlyWalletAccount_features = new WeakMap(), _ReadonlyWalletAccount_label = new WeakMap(), _ReadonlyWalletAccount_icon = new WeakMap();
/**
 * Efficiently compare {@link Indexed} arrays (e.g. `Array` and `Uint8Array`).
 *
 * @param a An array.
 * @param b Another array.
 *
 * @return `true` if the arrays have the same length and elements, `false` otherwise.
 *
 * @group Util
 */
export function arraysEqual(a, b) {
    if (a === b)
        return true;
    const length = a.length;
    if (length !== b.length)
        return false;
    for (let i = 0; i < length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
/**
 * Efficiently compare byte arrays, using {@link arraysEqual}.
 *
 * @param a A byte array.
 * @param b Another byte array.
 *
 * @return `true` if the byte arrays have the same length and bytes, `false` otherwise.
 *
 * @group Util
 */
export function bytesEqual(a, b) {
    return arraysEqual(a, b);
}
/**
 * Efficiently concatenate byte arrays without modifying them.
 *
 * @param first  A byte array.
 * @param others Additional byte arrays.
 *
 * @return New byte array containing the concatenation of all the byte arrays.
 *
 * @group Util
 */
export function concatBytes(first, ...others) {
    const length = others.reduce((length, bytes) => length + bytes.length, first.length);
    const bytes = new Uint8Array(length);
    bytes.set(first, 0);
    for (const other of others) {
        bytes.set(other, bytes.length);
    }
    return bytes;
}
/**
 * Create a new object with a subset of fields from a source object.
 *
 * @param source Object to pick fields from.
 * @param keys   Names of fields to pick.
 *
 * @return New object with only the picked fields.
 *
 * @group Util
 */
export function pick(source, ...keys) {
    const picked = {};
    for (const key of keys) {
        picked[key] = source[key];
    }
    return picked;
}
/**
 * Call a callback function, catch an error if it throws, and log the error without rethrowing.
 *
 * @param callback Function to call.
 *
 * @group Util
 */
export function guard(callback) {
    try {
        callback();
    }
    catch (error) {
        console.error(error);
    }
}
//# sourceMappingURL=util.js.map