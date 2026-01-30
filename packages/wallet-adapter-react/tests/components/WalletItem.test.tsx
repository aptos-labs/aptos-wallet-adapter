import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { WalletItem } from "../../src/components/WalletItem";
import { WalletContext, WalletContextState } from "../../src/useWallet";
import {
  createMockWallet,
  createMockNotDetectedWallet,
} from "../mocks/walletCore";

// Mock isRedirectable to control mobile behavior in tests
vi.mock("@aptos-labs/wallet-adapter-core", async () => {
  const actual = await vi.importActual("@aptos-labs/wallet-adapter-core");
  return {
    ...actual,
    isRedirectable: vi.fn(() => false),
    shouldUseFallbackWallet: vi.fn(() => false),
  };
});

describe("WalletItem", () => {
  const mockConnect = vi.fn();

  const mockContextValue: WalletContextState = {
    connected: false,
    isLoading: false,
    account: null,
    network: null,
    wallet: null,
    wallets: [],
    hiddenWallets: [],
    notDetectedWallets: [],
    connect: mockConnect,
    signIn: vi.fn(),
    disconnect: vi.fn(),
    signAndSubmitTransaction: vi.fn(),
    signTransaction: vi.fn(),
    signMessage: vi.fn(),
    signMessageAndVerify: vi.fn(),
    changeNetwork: vi.fn(),
    submitTransaction: vi.fn(),
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <WalletContext.Provider value={mockContextValue}>
      {children}
    </WalletContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render wallet information", () => {
      const wallet = createMockWallet("Test Wallet");

      render(
        <WalletItem wallet={wallet}>
          <WalletItem.Icon />
          <WalletItem.Name />
        </WalletItem>,
        { wrapper }
      );

      expect(screen.getByText("Test Wallet")).toBeInTheDocument();
      expect(screen.getByAltText("Test Wallet icon")).toBeInTheDocument();
    });

    it("should render Icon with correct src", () => {
      const wallet = createMockWallet();

      render(
        <WalletItem wallet={wallet}>
          <WalletItem.Icon />
        </WalletItem>,
        { wrapper }
      );

      expect(screen.getByAltText("Mock Wallet icon")).toHaveAttribute(
        "src",
        "data:image/svg+xml,<svg></svg>"
      );
    });
  });

  describe("ConnectButton", () => {
    it("should render connect button with default text", () => {
      const wallet = createMockWallet();

      render(
        <WalletItem wallet={wallet}>
          <WalletItem.ConnectButton />
        </WalletItem>,
        { wrapper }
      );

      expect(screen.getByRole("button", { name: "Connect" })).toBeInTheDocument();
    });

    it("should call connect with wallet name when clicked", () => {
      const wallet = createMockWallet("My Wallet");

      render(
        <WalletItem wallet={wallet}>
          <WalletItem.ConnectButton />
        </WalletItem>,
        { wrapper }
      );

      fireEvent.click(screen.getByRole("button", { name: "Connect" }));

      expect(mockConnect).toHaveBeenCalledWith("My Wallet");
    });

    it("should call onConnect callback when provided", () => {
      const wallet = createMockWallet();
      const onConnect = vi.fn();

      render(
        <WalletItem wallet={wallet} onConnect={onConnect}>
          <WalletItem.ConnectButton />
        </WalletItem>,
        { wrapper }
      );

      fireEvent.click(screen.getByRole("button", { name: "Connect" }));

      expect(onConnect).toHaveBeenCalled();
    });
  });

  describe("InstallLink", () => {
    it("should render install link with correct href", () => {
      const wallet = createMockNotDetectedWallet("New Wallet");

      render(
        <WalletItem wallet={wallet}>
          <WalletItem.InstallLink />
        </WalletItem>,
        { wrapper }
      );

      expect(screen.getByRole("link", { name: "Install" })).toHaveAttribute(
        "href",
        "https://not-detected-wallet.example.com"
      );
    });

    it("should render install link with target _blank", () => {
      const wallet = createMockNotDetectedWallet();

      render(
        <WalletItem wallet={wallet}>
          <WalletItem.InstallLink />
        </WalletItem>,
        { wrapper }
      );

      const link = screen.getByRole("link", { name: "Install" });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render with default Install text", () => {
      const wallet = createMockNotDetectedWallet();

      render(
        <WalletItem wallet={wallet}>
          <WalletItem.InstallLink />
        </WalletItem>,
        { wrapper }
      );

      expect(screen.getByRole("link")).toHaveTextContent("Install");
    });
  });

  describe("asChild prop", () => {
    it("should pass through asChild prop to render as child element", () => {
      const wallet = createMockWallet();

      render(
        <WalletItem wallet={wallet} asChild>
          <li>
            <WalletItem.Name />
          </li>
        </WalletItem>,
        { wrapper }
      );

      expect(screen.getByRole("listitem")).toBeInTheDocument();
    });
  });

  describe("context errors", () => {
    it("should throw when WalletItem.Icon is used outside WalletItem", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<WalletItem.Icon />, { wrapper });
      }).toThrow("`WalletItem.Icon` must be used within `WalletItem`");

      consoleSpy.mockRestore();
    });

    it("should throw when WalletItem.Name is used outside WalletItem", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<WalletItem.Name />, { wrapper });
      }).toThrow("`WalletItem.Name` must be used within `WalletItem`");

      consoleSpy.mockRestore();
    });

    it("should throw when WalletItem.ConnectButton is used outside WalletItem", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<WalletItem.ConnectButton />, { wrapper });
      }).toThrow("`WalletItem.ConnectButton` must be used within `WalletItem`");

      consoleSpy.mockRestore();
    });

    it("should throw when WalletItem.InstallLink is used outside WalletItem", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<WalletItem.InstallLink />, { wrapper });
      }).toThrow("`WalletItem.InstallLink` must be used within `WalletItem`");

      consoleSpy.mockRestore();
    });
  });

  describe("className prop", () => {
    it("should apply className to the root element", () => {
      const wallet = createMockWallet();

      const { container } = render(
        <WalletItem wallet={wallet} className="custom-class">
          <WalletItem.Name />
        </WalletItem>,
        { wrapper }
      );

      // The root element is the first div inside the container
      const rootElement = container.querySelector(".custom-class");
      expect(rootElement).toBeInTheDocument();
    });
  });
});
