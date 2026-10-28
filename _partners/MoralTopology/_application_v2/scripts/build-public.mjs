import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_ASSETS, __version__ } from "../scaffold.mjs";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(packageDir, "site");
const expected = ["index.html", "styles.css", "app.mjs", "cases.mjs", "model.mjs", "chart.mjs", "scaffold.mjs"];

if (!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(__version__) || JSON.stringify(PUBLIC_ASSETS) !== JSON.stringify(expected)) {
  throw new Error("Public asset allowlist or topology version is invalid for the reviewed v2 build contract.");
}
await mkdir(siteDir, { recursive: true });
const existing = await readdir(siteDir);
const unexpected = existing.filter((entry) => !PUBLIC_ASSETS.includes(entry));
if (unexpected.length) throw new Error(`Refusing to leave unexpected files in generated site/: ${unexpected.join(", ")}`);

for (const asset of PUBLIC_ASSETS) {
  if (asset.includes("..") || asset.includes(sep) || asset.startsWith(".")) throw new Error(`Unsafe public asset path: ${asset}`);
  const source = join(packageDir, asset);
  if (!(await stat(source)).isFile()) throw new Error(`Missing public source asset: ${source}`);
  await copyFile(source, join(siteDir, asset));
}
console.log(`Built Moral Topology v${__version__}: ${PUBLIC_ASSETS.join(", ")}`);
