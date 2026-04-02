import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getChainIdMock = vi.fn();

vi.mock("@aptos-labs/ts-sdk", () => {
  class Aptos {
    getChainId() {
      return getChainIdMock();
    }
  }

  return {
    Aptos,
    Network: {
      DEVNET: "devnet",
      MAINNET: "mainnet",
    },
  };
});

vi.mock("@aptos-connect/wallet-adapter-plugin", async () => {
  const { Aptos, Network } = await import("@aptos-labs/ts-sdk");

  class MockAptosConnectWallet {
    readonly version = "1.0.0";
    readonly chains: string[] = [];
    readonly accounts: string[] = [];
    readonly features = {};
    readonly icon = "data:image/svg+xml;base64,test";
    readonly url = "https://web.petra.app";
    readonly name: string;

    constructor(config: { network?: string }, name: string) {
      this.name = name;

      if (config.network === Network.DEVNET) {
        void new Aptos().getChainId();
      }
    }
  }

  return {
    AptosConnectGoogleWallet: class extends MockAptosConnectWallet {
      constructor(config: { network?: string }) {
        super(config, "Continue with Google");
      }
    },
    AptosConnectAppleWallet: class extends MockAptosConnectWallet {
      constructor(config: { network?: string }) {
        super(config, "Continue with Apple");
      }
    },
    AptosConnectGenericWallet: class extends MockAptosConnectWallet {
      constructor(config: { network?: string }) {
        super(config, "Petra Web");
      }
    },
  };
});

import { Network } from "@aptos-labs/ts-sdk";
import { getSDKWallets } from "../src/sdkWallets";

describe("getSDKWallets", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    getChainIdMock.mockResolvedValue(148);
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
      writable: true,
    });
  });

  it("dedupes constructor-time chain id lookups across SDK wallets", () => {
    const wallets = getSDKWallets({ network: Network.DEVNET } as any);

    expect(wallets).toHaveLength(3);
    expect(getChainIdMock).toHaveBeenCalledTimes(1);
  });

  it("restores Aptos.getChainId after wallet construction", async () => {
    getSDKWallets({ network: Network.DEVNET } as any);

    const { Aptos } = await import("@aptos-labs/ts-sdk");
    await new Aptos().getChainId();

    expect(getChainIdMock).toHaveBeenCalledTimes(2);
  });

  it("skips SDK wallet creation outside the browser", () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: undefined,
      writable: true,
    });

    const wallets = getSDKWallets({ network: Network.DEVNET } as any);

    expect(wallets).toEqual([]);
    expect(getChainIdMock).not.toHaveBeenCalled();
  });
});
