import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import dts from "vite-plugin-dts";

/**
 * @param {string} id
 * @param {string[]} depKeys
 * @param {string[]} bundleDependencies
 */
function isExternalModule(id, depKeys, bundleDependencies) {
  if (id.startsWith("\0") || id.startsWith(".") || path.isAbsolute(id)) {
    return false;
  }
  for (const b of bundleDependencies) {
    if (id === b || id.startsWith(`${b}/`)) return false;
  }
  return depKeys.some((dep) => id === dep || id.startsWith(`${dep}/`));
}

/**
 * @param {string} rootDir Absolute path to the package root (directory containing package.json).
 * @param {{ entry?: string; gaidDefine?: boolean; cssFileName?: string; bundleDependencies?: string[] }} [options]
 */
export function createLibViteConfig(rootDir, options = {}) {
  const {
    entry = "src/index.ts",
    gaidDefine = false,
    cssFileName,
    bundleDependencies = [],
  } = options;
  const pkg = JSON.parse(
    readFileSync(path.join(rootDir, "package.json"), "utf8"),
  );
  const depKeys = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ];

  return defineConfig(({ mode }) => {
    const env = loadEnv(mode, rootDir, "");
    const define = gaidDefine
      ? {
          "process.env.GAID": JSON.stringify(
            env.GAID ?? process.env.GAID ?? "",
          ),
        }
      : undefined;

    return {
      ...(define ? { define } : {}),
      build: {
        lib: {
          entry: path.join(rootDir, entry),
          formats: ["es"],
          fileName: "index",
          ...(cssFileName ? { cssFileName } : {}),
        },
        sourcemap: true,
        rollupOptions: {
          external: (id) => isExternalModule(id, depKeys, bundleDependencies),
          output: {
            inlineDynamicImports: true,
          },
        },
      },
      plugins: [
        dts({
          // rollupTypes loses explicit re-exports for some barrels (e.g. ant-design / mui entrypoints).
          rollupTypes: false,
          tsconfigPath: path.join(rootDir, "tsconfig.json"),
          include: ["src/**/*"],
          exclude: ["**/*.{test,spec}.{ts,tsx}", "**/tests/**"],
        }),
      ],
    };
  });
}
