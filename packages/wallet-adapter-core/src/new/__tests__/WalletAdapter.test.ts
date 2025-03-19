import {
  AccountInfo,
  AptosConnectMethod,
  AptosDisconnectMethod,
  AptosFeatures,
  AptosGetAccountMethod,
  AptosGetNetworkMethod,
  AptosOnAccountChangeMethod,
  AptosOnNetworkChangeMethod,
} from '@aptos-labs/wallet-standard';
import { AptosStandardWallet } from '../AptosStandardWallet';
import { StandardNetwork } from '../network';
import { makeUserApproval, makeUserRejection } from '../utils';
import { WalletAdapter } from '../WalletAdapter';

function makeTestAdapterFromFields({ chains = [], ...rest }: Partial<AptosStandardWallet>) {
  return new WalletAdapter({ chains, ...rest } as AptosStandardWallet);
}

function makeTestAdapter(features: Partial<AptosFeatures>) {
  return makeTestAdapterFromFields({ features: features as AptosFeatures });
}

describe('WalletAdapter', () => {
  test('fields', () => {
    const adapter = makeTestAdapterFromFields({
      name: 'Test wallet',
      icon: 'data:image/svg+xml;base64,deadbeef',
      url: 'https://test-wallet.com',
    });

    expect(adapter.name).toBe('Test wallet');
    expect(adapter.icon).toBe('data:image/svg+xml;base64,deadbeef');
    expect(adapter.url).toBe('https://test-wallet.com');
  });

  test('connect', async () => {
    const connect: jest.MockedFn<AptosConnectMethod> = jest.fn();
    const adapter = makeTestAdapter({
      'aptos:connect': {
        version: '1.0.0',
        connect,
      },
    });

    const onAccountConnected = jest.fn();
    const unsubscribe = adapter.on('accountConnected', onAccountConnected);
    expect(adapter['onAccountConnectedListeners'].size).toBe(1);

    const mockRejection = makeUserRejection();
    connect.mockResolvedValueOnce(mockRejection);
    await expect(adapter.connect()).resolves.toBe(mockRejection);
    expect(onAccountConnected).not.toHaveBeenCalled();

    const mockApproval = makeUserApproval({} as any);
    connect.mockResolvedValueOnce(mockApproval);
    await expect(adapter.connect()).resolves.toBe(mockApproval);
    expect(onAccountConnected).toHaveBeenCalledWith(mockApproval.args);

    unsubscribe();
    expect(adapter['onAccountConnectedListeners'].size).toBe(0);
  });

  test('disconnect', async () => {
    const disconnect: jest.MockedFn<AptosDisconnectMethod> = jest.fn();
    const adapter = makeTestAdapter({
      'aptos:disconnect': {
        version: '1.0.0',
        disconnect,
      },
    });

    const onAccountDisconnected = jest.fn();
    const unsubscribe = adapter.on('accountDisconnected', onAccountDisconnected);
    expect(adapter['onAccountDisconnectedListeners'].size).toBe(1);

    await adapter.disconnect();
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(onAccountDisconnected).toHaveBeenCalledTimes(1);

    unsubscribe();
    expect(adapter['onAccountDisconnectedListeners'].size).toBe(0);
  });

  test('getActiveAccount', async () => {
    const getActiveAccount: jest.MockedFn<AptosGetAccountMethod> = jest.fn();
    const adapter = makeTestAdapter({
      'aptos:account': {
        version: '1.0.0',
        account: getActiveAccount,
      },
    });

    const mockAccount: AccountInfo = {} as any;
    getActiveAccount.mockResolvedValueOnce(mockAccount);
    await expect(adapter.getActiveAccount()).resolves.toBe(mockAccount);
    expect(getActiveAccount).toHaveBeenCalledTimes(1);

    getActiveAccount.mockRejectedValueOnce(new Error('Not connected'));
    await expect(adapter.getActiveAccount()).resolves.toBe(undefined);
    expect(getActiveAccount).toHaveBeenCalledTimes(2);

    getActiveAccount.mockResolvedValueOnce(mockAccount);
    await expect(adapter.getConnectedAccounts()).resolves.toEqual([mockAccount]);
  });

  test('getActiveNetwork', async () => {
    const getActiveNetwork: jest.MockedFn<AptosGetNetworkMethod> = jest.fn();
    const adapter = makeTestAdapter({
      'aptos:network': {
        version: '1.0.0',
        network: getActiveNetwork,
      },
    });

    getActiveNetwork.mockResolvedValueOnce({
      name: StandardNetwork.TESTNET,
      chainId: 2,
    });
    await expect(adapter.getActiveNetwork()).resolves.toBe(StandardNetwork.TESTNET);
    expect(getActiveNetwork).toHaveBeenCalledTimes(1);

    getActiveNetwork.mockRejectedValueOnce(new Error('Not connected'));
    await expect(adapter.getActiveNetwork()).resolves.toBe(StandardNetwork.MAINNET);
    expect(getActiveNetwork).toHaveBeenCalledTimes(2);
  });

  test('getAvailableNetworks', async () => {
    const adapter = makeTestAdapterFromFields({
      chains: ['aptos:mainnet', 'aptos:testnet'],
    });
    await expect(adapter.getAvailableNetworks()).resolves.toEqual([
      StandardNetwork.MAINNET,
      StandardNetwork.TESTNET,
    ]);
  });

  test('onActiveAccountChanged', () => {
    const onActiveAccountChange: jest.MockedFn<AptosOnAccountChangeMethod> = jest.fn();
    const adapter = makeTestAdapter({
      'aptos:onAccountChange': {
        version: '1.0.0',
        onAccountChange: onActiveAccountChange,
      },
    });

    const callback = jest.fn();
    const unsubscribe = adapter.on('activeAccountChanged', callback);
    expect(onActiveAccountChange).toHaveBeenCalledTimes(1);
    const [internalCallback] = onActiveAccountChange.mock.lastCall!;

    const mockAccount: AccountInfo = {} as any;
    internalCallback(mockAccount);
    expect(callback).toHaveBeenCalledWith(mockAccount);

    unsubscribe();
    expect(onActiveAccountChange).toHaveBeenCalledTimes(2);
    expect(onActiveAccountChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ '_isNull': true }),
    );
  });

  test('onActiveNetworkChanged', () => {
    const onActiveNetworkChange: jest.MockedFn<AptosOnNetworkChangeMethod> = jest.fn();
    const adapter = makeTestAdapter({
      'aptos:onNetworkChange': {
        version: '1.0.0',
        onNetworkChange: onActiveNetworkChange,
      },
    });

    const callback = jest.fn();
    const unsubscribe = adapter.on('activeNetworkChanged', callback);
    expect(onActiveNetworkChange).toHaveBeenCalledTimes(1);
    const [internalCallback] = onActiveNetworkChange.mock.lastCall!;

    internalCallback({
      name: StandardNetwork.TESTNET,
      chainId: 2,
    });
    expect(callback).toHaveBeenCalledWith(StandardNetwork.TESTNET);

    unsubscribe();
    expect(onActiveNetworkChange).toHaveBeenCalledTimes(2);
    expect(onActiveNetworkChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ '_isNull': true }),
    );
  });
});
