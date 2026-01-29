# Vue/Nuxt Extraction Plan

## Overview
Extract `wallet-adapter-vue` package and `nuxt-example` app from the main aptos-wallet-adapter monorepo into a separate repository.

## What Needs to Be Moved

### 1. Packages
- **`packages/wallet-adapter-vue/`** - Vue integration package (v1.0.1)
  - Full directory with source code, dist, tests, config files
  - Package dependencies: `@aptos-labs/wallet-adapter-core@5.0.0`
  - Peer dependencies: `vue@^3.5.21`
  - Published to npm as `@aptos-labs/wallet-adapter-vue`

### 2. Apps
- **`apps/nuxt-example/`** - Nuxt.js demo application
  - Full directory with all source code and configuration
  - Dependencies:
    - `@aptos-labs/wallet-adapter-core` (workspace)
    - `@aptos-labs/wallet-adapter-vue` (workspace)
    - Nuxt 3 and related packages

## Current References in Main Repo

### Configuration Files
1. **`package.json` (root)**
   - Line 8: `"dev": "turbo run dev --no-cache --parallel --continue --filter=!nuxt-app"`
   - **Action**: Remove `--filter=!nuxt-app` filter

2. **`pnpm-workspace.yaml`**
   - Uses wildcards (`apps/*`, `packages/*`)
   - **Action**: No changes needed (wildcards will naturally exclude removed dirs)

3. **`turbo.json`**
   - No specific Vue/Nuxt configuration
   - **Action**: No changes needed

### Documentation Files
1. **`CONTRIBUTING.md`**
   - Line 12: Generic mention of "vue" in example
   - Line 21: Generic mention of "vue-provider" in example
   - **Action**: These are generic examples, can remain unchanged

2. **`CLAUDE.md`**
   - Line 24: `│   └── nuxt-example/  # Vue/Nuxt integration demo`
   - Line 30: `│   ├── wallet-adapter-vue/  # Vue integration (deprecated)`
   - Line 265: `- Vue support (wallet-adapter-vue) exists but is not actively promoted`
   - **Action**: Remove all three references

3. **`README.md`**
   - No references to Vue or Nuxt
   - **Action**: No changes needed

### Other Files
- **`packages/wallet-adapter-vue/CHANGELOG.md`** - Move to new repo
- **`packages/wallet-adapter-vue/README.md`** - Move to new repo
- **`apps/nuxt-example/README.md`** - Move to new repo

## New Repository Structure

```
aptos-wallet-adapter-vue/
├── .github/                          # GitHub workflows and config
│   └── workflows/
│       ├── publish.yml              # npm publish workflow
│       └── test.yml                 # CI testing
├── apps/
│   └── nuxt-example/                # Nuxt demo app
├── packages/
│   └── wallet-adapter-vue/          # Vue package
├── .changeset/                       # Changeset configuration
├── .gitignore
├── .npmrc
├── .tool-versions                    # Node/pnpm versions
├── LICENSE                           # Copy from main repo
├── README.md                         # New README for Vue/Nuxt repo
├── CONTRIBUTING.md                   # Contribution guidelines
├── CLAUDE.md                         # AI context for new repo
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml              # Workspace definition
├── pnpm-lock.yaml                   # Will be generated
├── tsconfig.json                     # Shared TS config
├── turbo.json                        # Turbo configuration
└── MIGRATION.md                      # Migration guide from old to new repo
```

## Dependencies to Handle

### External Dependencies
Both packages will need to specify `@aptos-labs/wallet-adapter-core` as a peer dependency or regular dependency from npm (not workspace).

**Current**: `"@aptos-labs/wallet-adapter-core": "workspace:*"`
**New**: `"@aptos-labs/wallet-adapter-core": "^5.0.0"` (or latest)

### Shared Configuration
The new repo will need copies of:
- TypeScript configuration
- ESLint configuration
- Turbo configuration (simplified for Vue-only)
- Changeset configuration
- LICENSE file

## Step-by-Step Extraction Process

### Phase 0: Prepare Main Repository Branch
1. Ensure current work is committed or stashed
2. Checkout main branch: `git checkout main`
3. Pull latest changes: `git pull origin main`
4. Create new branch: `git checkout -b refactor/remove-vue-nuxt-packages`

### Phase 1: Prepare New Repository
1. Create new GitHub repository `aptos-wallet-adapter-vue`
2. Initialize with basic structure (root files)
3. Set up pnpm workspace configuration
4. Configure Turbo for Vue/Nuxt monorepo
5. Copy LICENSE and terms from main repo
6. Create new README specific to Vue/Nuxt integration with note at top:
   ```
   > **_NOTE:_** This package is community maintained and not actively maintained by the Aptos Labs engineering team.
   ```

### Phase 2: Copy Packages to New Repository
1. Copy `packages/wallet-adapter-vue/` to new repo
2. Copy `apps/nuxt-example/` to new repo
3. Update package.json in both to use npm versions of core (not workspace)
4. Update import paths if necessary
5. Add necessary shared configuration files

### Phase 3: Test New Repository
1. Run `pnpm install` in new repo
2. Build wallet-adapter-vue package
3. Build and run nuxt-example app
4. Verify all functionality works
5. Run tests if they exist

### Phase 4: Remove from Main Repository (on branch)
1. Delete `packages/wallet-adapter-vue/` directory
2. Delete `apps/nuxt-example/` directory
3. Update root `package.json` dev script (remove `--filter=!nuxt-app`)
4. Update `CLAUDE.md` (remove Vue/Nuxt references)
5. Verify CONTRIBUTING.md (keep generic mentions)
6. Run `pnpm install` to update lock file
7. Run `pnpm build` to verify nothing breaks
8. Run `pnpm test` to verify tests pass
9. Commit changes: `git add .` and create commit
10. Push branch: `git push -u origin refactor/remove-vue-nuxt-packages`

### Phase 5: Documentation
1. Add deprecation notice to old package on npm
2. Update main repo docs to point to new repo
3. Create migration guide in new repo
4. Add README to new repo explaining the separation
5. Archive or deprecate old npm package versions

### Phase 6: Publish and Announce
1. Publish new versions from new repo to npm
2. Create GitHub releases
3. Announce the separation in main repo README
4. Update documentation links

## Risks and Considerations

### Breaking Changes
- Users importing `@aptos-labs/wallet-adapter-vue` will need to update
- Package repository URL will change
- Installation instructions will change

### Mitigation Strategies
- Add deprecation notice to old package
- Publish new versions with migration guide
- Keep old versions available on npm
- Add clear migration documentation

### Communication Plan
- Update main repo README with notice
- Create migration guide in new repo
- Announce in Discord/community channels
- Add deprecation warnings to old package

## Rollback Plan
If extraction fails:
1. Revert deletion commits in main repo
2. Keep new repo as experimental
3. Document issues and blockers
4. Re-evaluate extraction strategy

## Success Criteria
- [ ] New repo builds successfully
- [ ] Nuxt example app runs without errors
- [ ] All tests pass in both repos
- [ ] npm packages can be published from new repo
- [ ] Main repo builds and tests pass after removal
- [ ] Documentation is updated and clear
- [ ] Migration guide exists and is accurate

## Timeline Estimate
- Phase 1 (Prepare): 1-2 hours
- Phase 2 (Copy): 30 minutes
- Phase 3 (Test): 1 hour
- Phase 4 (Remove): 30 minutes
- Phase 5 (Documentation): 1-2 hours
- Phase 6 (Publish): 1 hour

**Total**: ~5-7 hours of work

## Post-Extraction Maintenance
- New repo will need independent CI/CD
- Separate release cycle from main adapter
- Independent versioning
- May have slower update cycle
- Community may need to maintain if Aptos Labs deprioritizes
