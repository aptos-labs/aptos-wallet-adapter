#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const constName = process.argv[2];
if (!constName) {
  console.error("Usage: write-version.mjs <CONST_NAME>");
  process.exit(1);
}
const pkgPath = join(process.cwd(), "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const content = `export const ${constName} = ${JSON.stringify(pkg.version)};\n`;
writeFileSync(join(process.cwd(), "src", "version.ts"), content);
