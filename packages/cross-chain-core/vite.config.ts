import { fileURLToPath } from "node:url";
import { createLibViteConfig } from "../../scripts/create-lib-vite-config.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));

export default createLibViteConfig(root, {
  entry: "src/index.ts",
  gaidDefine: true,
});
