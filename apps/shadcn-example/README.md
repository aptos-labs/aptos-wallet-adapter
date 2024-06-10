# Aptos Wallet Adapter `shadcn/ui` Example

This project is an implementation of an Aptos Wallet Selector using Next.js and shadcn/ui. If you want to add an Aptos Wallet Selector to your shadcn-based app, follow these steps:

- Follow the [shadcn/ui installation instructions](https://ui.shadcn.com/docs/installation) if you haven't already configured it in your app.

- Run the following command to install all of the shadcn/ui components that the wallet selector depends on:

```bash
npx shadcn-ui@latest add button collapsible dialog dropdown-menu toast
```

- Copy the [wallet-selector.tsx](./src/components/wallet-selector.tsx) file from this repo to your `src/components/` directory.

- If you have not already configured `AptosWalletAdapterProvider` for your app, you can also copy the [wallet-provider.tsx](./src/components/wallet-provider.tsx) file from this repo. Be sure to install the `@aptos-labs/wallet-adapter-react` package and the wallet adapter plugins for the wallet options you plan to support.

- Wrap your app with the `WalletProvider` component. See [layout.tsx](./src/app/layout.tsx) for an example.

- Render `<WalletSelector />` in your app where you want to place the "Connect Wallet" button. See [page.tsx](./src/app/page.tsx) as an example.

## Run Example Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - learn about shadcn/ui features and API.
