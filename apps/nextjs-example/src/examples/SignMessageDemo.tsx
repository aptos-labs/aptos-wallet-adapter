import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const SignMessageDemo = () => {
  const { signMessage, signMessageAndVerify, connected, account } = useWallet();
  const [message, setMessage] = useState<string>('');
  const [nonce, setNonce] = useState<string>('');
  const [signedMessage, setSignedMessage] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignMessage = async () => {
    setError(null);
    try {
      const response = await signMessage({ message, nonce });
      setSignedMessage(response);
    } catch (err: any) {
      setError(`Failed to sign message: ${err.message}`);
    }
  };

  const handleVerifyMessage = async () => {
    setError(null);
    try {
      const result = await signMessageAndVerify({ message, nonce });
      setVerificationResult(result);
    } catch (err: any) {
      setError(`Failed to verify message: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Aptos Sign and Verify Message</h1>
      <div>
        {connected ? (
          <div>
            <p>Connected to: {account?.address}</p>
            <div className="flex flex-col gap-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here"
                className="border rounded p-2"
              />
              <input
                type="text"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                placeholder="Enter nonce (random string) here"
                className="border rounded p-2 mt-2"
              />
              <button onClick={handleSignMessage} className="bg-blue-500 text-white rounded p-2 mt-2">
                Sign Message
              </button>
              {signedMessage && (
                <div>
                  <h4>Signed Message</h4>
                  <pre>{JSON.stringify(signedMessage, null, 2)}</pre>
                  <button onClick={handleVerifyMessage} className="bg-green-500 text-white rounded p-2 mt-2">
                    Verify Message
                  </button>
                </div>
              )}
              {verificationResult !== null && (
                <div>
                  <h4>Verification Result</h4>
                  <p>{verificationResult ? 'Message is verified!' : 'Failed to verify message.'}</p>
                </div>
              )}
              {error && (
                <div className="text-red-600">
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Please connect your wallet to sign and verify messages.</p>
        )}
      </div>
    </div>
  );
};

export default SignMessageDemo;
