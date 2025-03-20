import { getErrorMessage } from './message-formatter.js';
export function isWalletStandardError(e, code) {
    const isWalletStandardError = e instanceof Error && e.name === 'WalletStandardError';
    if (isWalletStandardError) {
        if (code !== undefined) {
            return e.context.__code === code;
        }
        return true;
    }
    return false;
}
export class WalletStandardError extends Error {
    constructor(...[code, contextAndErrorOptions]) {
        let context;
        let errorOptions;
        if (contextAndErrorOptions) {
            // If the `ErrorOptions` type ever changes, update this code.
            const { cause, ...contextRest } = contextAndErrorOptions;
            if (cause) {
                errorOptions = { cause };
            }
            if (Object.keys(contextRest).length > 0) {
                context = contextRest;
            }
        }
        const message = getErrorMessage(code, context);
        super(message, errorOptions);
        this.context = {
            __code: code,
            ...context,
        };
        // This is necessary so that `isWalletStandardError()` can identify a `WalletStandardError`
        // without having to import the class for use in an `instanceof` check.
        this.name = 'WalletStandardError';
    }
}
//# sourceMappingURL=error.js.map