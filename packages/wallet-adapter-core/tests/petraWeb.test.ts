import { Network } from "@aptos-labs/ts-sdk";
import {
  getWallets,
  isWalletWithRequiredFeatureSet,
} from "@aptos-labs/wallet-standard";
import { PetraWebWallet } from "@petra-app/wallet-adapter-plugin";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WalletCore } from "../src/WalletCore";

const googleWalletName = "Continue with Google";
const appleWalletName = "Continue with Apple";
const genericWalletName = "Petra Web";

/** Stands in for the popup that `window.open` returns. */
function stubPopup() {
  const popup = {
    closed: false,
    close: vi.fn(),
    location: { replace: vi.fn() },
    postMessage: vi.fn(),
  };
  const open = vi
    .spyOn(window, "open")
    .mockReturnValue(popup as unknown as Window);
  return { open, popup };
}

function names(wallets: ReadonlyArray<{ name: string }>) {
  return wallets.map((wallet) => wallet.name);
}

describe("built-in Petra Web wallets", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("installs the social wallets and hides the generic wallet", async () => {
    const core = new WalletCore(
      undefined,
      {
        network: Network.TESTNET,
        petraWeb: { frontendBaseURL: "https://prompt.example.test" },
      },
      true,
    );

    expect(names(core.wallets)).toEqual([googleWalletName, appleWalletName]);
    expect(names(core.hiddenWallets)).toEqual([genericWalletName]);

    for (const wallet of [...core.wallets, ...core.hiddenWallets]) {
      expect(wallet).toBeInstanceOf(PetraWebWallet);
      expect(isWalletWithRequiredFeatureSet(wallet)).toBe(true);
      expect(await wallet.features["aptos:network"].network()).toMatchObject({
        chainId: 2,
        name: Network.TESTNET,
      });
    }
  });

  it("passes the dapp's options to the wallets", async () => {
    const { open, popup } = stubPopup();
    const core = new WalletCore(
      undefined,
      {
        network: Network.TESTNET,
        petraWeb: { frontendBaseURL: "https://prompt.example.test" },
      },
      true,
    );

    const connection = core.connect(googleWalletName);
    const rejection = expect(connection).rejects.toBe(
      "User has rejected the request",
    );
    await vi.waitFor(() => {
      expect(popup.location.replace).toHaveBeenCalledExactlyOnceWith(
        "https://prompt.example.test/prompt/?provider=google",
      );
    });
    expect(open).toHaveBeenCalledOnce();

    // The user closes the popup
    popup.closed = true;
    await rejection;
    expect(core.isConnected()).toBe(false);
  });

  it("shows the generic wallet when the dapp hides nothing", () => {
    const core = new WalletCore(
      undefined,
      { network: Network.TESTNET },
      true,
      [],
    );

    expect(names(core.wallets)).toEqual([
      googleWalletName,
      appleWalletName,
      genericWalletName,
    ]);
    expect(core.hiddenWallets).toEqual([]);
  });

  it("keeps a wallet that the dapp registered before the adapter started", () => {
    const registered = new PetraWebWallet("generic", {
      dappName: "Preconfigured",
      network: Network.TESTNET,
    });
    const unregister = getWallets().register(registered);
    try {
      const core = new WalletCore(
        undefined,
        { network: Network.TESTNET },
        true,
      );

      const genericWallets = [...core.wallets, ...core.hiddenWallets].filter(
        (wallet) => wallet.name === genericWalletName,
      );
      expect(genericWallets).toHaveLength(1);
      expect(genericWallets[0]).toBe(registered);
      expect(names(core.wallets)).toEqual([googleWalletName, appleWalletName]);
    } finally {
      unregister();
    }
  });
});
