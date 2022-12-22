import { AptosAccount } from "aptos";
import {
  SignMessagePayload,
  SignMessageResponse,
  Wallet,
  WalletName,
} from "../types";
import { WalletCore } from "../WalletCore";

const signMessageResponseMock: SignMessageResponse = {
  fullMessage: "",
  message: "message",
  nonce: Date.now().toString(),
  prefix: "APTOS",
  signature: "",
};

const mockSignMessagePayload: SignMessagePayload = {
  message: "my-message",
  nonce: Date.now().toString(),
};

const connectMock = jest.fn(() => Promise.resolve(console.log("connect")));
const disconnectMock = jest.fn(() =>
  Promise.resolve(console.log("disconnect"))
);
const networkMock = jest.fn(() => Promise.resolve(console.log("network")));
const signAndSubmitTransactionkMock = jest.fn((transaction, options?) =>
  Promise.resolve({ hash: "signAndSubmitTransactionkMock" })
);
const signMessageMock = jest.fn((message) =>
  Promise.resolve(signMessageResponseMock)
);

const onNetworkChangeeMock = jest.fn((callback: any) =>
  Promise.resolve(console.log("onNetworkChange"))
);
const onAccountChangeMock = jest.fn((callback: any) =>
  Promise.resolve(console.log("onAccountChangeMock"))
);

const walletMock: Wallet = {
  name: "wallet-name" as WalletName<"wallet-name">,
  url: "my-url",
  icon: `data:image/png;base64,uri`,
  provider: {},
  connect: connectMock,
  disconnect: disconnectMock,
  network: networkMock,
  signAndSubmitTransaction: signAndSubmitTransactionkMock,
  signMessage: signMessageMock,
  onNetworkChange: onNetworkChangeeMock,
  onAccountChange: onAccountChangeMock,
};

const pluginsMock: Wallet[] = [walletMock];

const walletCoreMock = new WalletCore(pluginsMock);

describe("signMessageAndVerify", () => {
  walletCoreMock.setWallet(walletMock);
  const account = new AptosAccount();
  walletCoreMock.setAccount({
    address: account.address().hex(),
    publicKey: account.pubKey().hex(),
  });
  signMessageResponseMock.fullMessage = `\nmessage: ${signMessageResponseMock.message} \nnonce: ${signMessageResponseMock.nonce}`;
  jest
    .spyOn(walletCoreMock as any, "doesWalletExist")
    .mockImplementation(() => true);

  it("it should verify a signed message", async () => {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(signMessageResponseMock.fullMessage);
    const signature = account.signBuffer(messageBytes);
    const signatureString = signature.noPrefix();
    signMessageResponseMock.signature = signatureString;

    jest
      .spyOn((walletCoreMock as any)._wallet, "signMessage")
      .mockResolvedValue(signMessageResponseMock);

    const verified = await walletCoreMock.signMessageAndVerify(
      mockSignMessagePayload
    );
    expect(verified).toBeTruthy();
  });

  it("it should fails to verify signed message", async () => {
    const account2 = new AptosAccount();
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(signMessageResponseMock.fullMessage);
    const signature = account2.signBuffer(messageBytes);
    const signatureString = signature.noPrefix();
    signMessageResponseMock.signature = signatureString;

    jest
      .spyOn((walletCoreMock as any)._wallet, "signMessage")
      .mockResolvedValue(signMessageResponseMock);

    const verified = await walletCoreMock.signMessageAndVerify(
      mockSignMessagePayload
    );
    expect(verified).toBeFalsy();
  });
});
