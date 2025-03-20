export function safeCaptureStackTrace(...args) {
    if ('captureStackTrace' in Error && typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(...args);
    }
}
//# sourceMappingURL=stack-trace.js.map