import React from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

const ChangeNetworkDemo = () => {
  const { network, changeNetwork, wallet } = useWallet();
  // Update this with a non-manual check to verify whether the network change is a supported feature.
  // Or have error handling if a network change is attempted for a wallet that does not support the feature.
  const isNetworkChangeSupported = wallet?.name === "Nightly";

  const isValidNetworkName = () => {
    return network && Object.values<string>(Network).includes(network.name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Network Info</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
        <div><strong>Network name</strong></div>
        <div>
          <span style={{ color: isValidNetworkName() ? 'green' : 'red' }}>
            {network?.name ?? 'Not Present'}
          </span>
          {` (Expected: ${Object.values<string>(Network).join(', ')})`}
        </div>
        <div><strong>URL</strong></div>
        <div>
          {network?.url ? (
            <a href={network.url} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>
              {network.url}
            </a>
          ) : (
            'Not Present'
          )}
        </div>
        <div><strong>Chain ID</strong></div>
        <div>{network?.chainId ?? 'Not Present'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Change Network</h4>
        <div style={{ display: 'flex', gap: '16px' }}>
          <label>
            <input
              type="radio"
              name="network"
              value={Network.DEVNET}
              checked={network?.name === Network.DEVNET}
              onChange={() => changeNetwork(Network.DEVNET)}
              disabled={!isNetworkChangeSupported}
            />
            Devnet
          </label>
          <label>
            <input
              type="radio"
              name="network"
              value={Network.TESTNET}
              checked={network?.name === Network.TESTNET}
              onChange={() => changeNetwork(Network.TESTNET)}
              disabled={!isNetworkChangeSupported}
            />
            Testnet
          </label>
          <label>
            <input
              type="radio"
              name="network"
              value={Network.MAINNET}
              checked={network?.name === Network.MAINNET}
              onChange={() => changeNetwork(Network.MAINNET)}
              disabled={!isNetworkChangeSupported}
            />
            Mainnet
          </label>
        </div>
        {!isNetworkChangeSupported && (
          <div style={{ fontSize: '0.875rem', color: 'red' }}>
            * {wallet?.name ?? 'This wallet'} does not support network change requests
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeNetworkDemo;
