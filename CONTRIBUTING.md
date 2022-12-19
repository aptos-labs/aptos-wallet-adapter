# Contributing to Aptos Wallet Adapter

---

### Understand the Repo

Aptos Wallet Adapter is a monorepo built with [turbo](https://turbo.build/repo/docs) and follows its file structure convention. The repo has 2 workspaces `apps` and `packages`

#### Apps Workspace

The App workspace hold different web apps such as the adapter demo app (a nextjs app).
You are welcome to add different apps (react/vue/etc) in this workspace (make sure you are following turbo best pratices on how to do it)

#### Packages Workspace

The packages workspace holds 2 packages

1. `wallet-adapter-core` - the core adapter logic that responsible on the adapter functionality, state and the interaction between the dapp and wallet.
2. `wallet-adapter-react` - a light react provider that dapps can import and use the adapter.

You are welcome to add packages (vue-provider/UI frameworks/etc) in this workspace (make sure you are following turbo best pratices on how to do it)

### Creating a pull request

You are welcome to create a pull reuqest against the `main` branch.

Before creating a PR, on the `root` folder

1. Make sure you are up to date with the `main` branch
2. Run `pnpm install`
3. Run `pnpm turbo run build`

If everything passes, you should be able to create a PR.

#### Changesets

We use [changesets](https://github.com/changesets/changesets) to handle any changes in the `changelog`.
If a pull request created that need to bump a package version, please follow those steps to create a `changelog`

1. Run `pnpm run changeset` and follow the prompt instructions (we follow [SemVer](https://semver.org/))
2. Under `.changeset/` you will notice a new markdown file (its name is randomly generated), with the change-type and summary.
3. Push the file along with the rest of the changes

Once your PR will be merged, our Github action will create a new PR with that generated changelog for us to merge, once the generated PR is merged a new version will be published to npm.

### Develop Locally

You would need `pnpm@7.14.2` in order to bootstrap and test a local copy of this repo.

1. Clone the repo with `git clone https://github.com/aptos-labs/aptos-wallet-adapter.git`
2. Run `pnpm install` and `pnpm turbo run build`
3. Run `pnpm turbo run dev` - that would spin up a local server (`localhost:3000`) with the `nextjs` demoapp
