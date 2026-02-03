# Aptos Wallet Adapter Selector MUI Design

Package for wallet selector modal using [Material-UI (MUI)](https://mui.com/). Includes a `wallet connect` button when clicked, opens up a `wallet select modal`.

If wallet is already connected, the button would display the connected account address truncated (i.e `0x123...abc`), in that case, clicking the button would disconnect the wallet.

## Installation

Make sure you have [@aptos-labs/wallet-adapter-react](../wallet-adapter-react/README.md) installed

```bash
npm install @aptos-labs/wallet-adapter-mui-design
```

## Usage

On the page you want to include the `wallet connect` button, import the `WalletConnector` module.

```tsx
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";

// ...

return <WalletConnector />;
```

That would add a `Connect Wallet` button when clicked opens up a `wallet selector` modal.

### Full Example

```tsx
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { Network } from "@aptos-labs/ts-sdk";

function App() {
  return (
    <AptosWalletAdapterProvider
      dappConfig={{ network: Network.MAINNET }}
      onError={(error) => console.error(error)}
    >
      <WalletConnector />
    </AptosWalletAdapterProvider>
  );
}
```

## Components

### WalletConnector

The main component that provides the wallet connection button and modal.

```tsx
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";

<WalletConnector />
```

### Customization

The MUI components can be styled using the standard MUI theming system. Wrap your app with a `ThemeProvider` to customize colors, typography, and other design tokens.

```tsx
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <WalletConnector />
    </ThemeProvider>
  );
}
```

## Related Packages

- [@aptos-labs/wallet-adapter-react](../wallet-adapter-react/) - React provider and hooks
- [@aptos-labs/wallet-adapter-ant-design](../wallet-adapter-ant-design/) - Ant Design alternative

## License

Apache-2.0

