import {
  AptosFeatures,
  AptosWallet as AptosStandardWallet,
  MinimallyRequiredFeatures,
  Wallet,
} from '@aptos-labs/wallet-standard';

type FeatureVersion = `${number}.${number}` | `${number}.${number}.${number}`;
type TargetVersion = `${number}.${number}`;

/**
 * Required features with minimum versions.
 * In the future, we might choose to slowly deprecate older versions to simplify the adapter's code.
 */
const requiredFeatures: [name: keyof MinimallyRequiredFeatures, version: TargetVersion][] = [
  ['aptos:account', '1.0'],
  ['aptos:connect', '1.0'],
  ['aptos:disconnect', '1.0'],
  ['aptos:network', '1.0'],
  ['aptos:onAccountChange', '1.0'],
  ['aptos:onNetworkChange', '1.0'],
  ['aptos:signMessage', '1.0'],
  ['aptos:signTransaction', '1.0'],
];

/**
 * Check whether the specified version is compatible with a target version
 */
function isVersionCompatible(value: FeatureVersion, target: TargetVersion) {
  const [major, minor] = value.split('.').map(Number);
  const [tgtMajor, tgtMinor] = target.split('.').map(Number);
  return major === tgtMajor && minor >= tgtMinor;
}

/**
 * Check whether a generic wallet is an Aptos standard wallet.
 *
 * The wallet needs to implement all the required features with minimum version.
 * @param wallet generic wallet to be considered compatible.
 */
export function isAptosStandardWallet(wallet: Wallet): wallet is AptosStandardWallet {
  const features = wallet.features as Partial<AptosFeatures>;
  for (const [name, targetVersion] of requiredFeatures) {
    const feature = features[name];
    if (!feature || !isVersionCompatible(feature.version, targetVersion)) {
      return false;
    }
  }
  return true;
}

export type { AptosStandardWallet };
