export function isFeatureMinorVersion<
  FeatureVersion extends `${number}.${number}` | `${number}.${number}.${number}`,
  TargetVersion extends `${number}.${number}`>(
  feature: { version: FeatureVersion },
  targetVersion: TargetVersion,
): feature is FeatureVersion extends TargetVersion | `${TargetVersion}.${number}` ? {
  version: FeatureVersion
} : never {
  return feature.version.startsWith(targetVersion);
}
