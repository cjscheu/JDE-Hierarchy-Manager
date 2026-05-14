import fs from "node:fs";
import path from "node:path";

const appVersion = process.env.APP_VERSION || "1.1.0";
const targetPath = path.resolve("src", "build-meta.ts");

let currentBuild = 0;

if (fs.existsSync(targetPath)) {
  const currentContent = fs.readFileSync(targetPath, "utf8");
  const buildMatch = currentContent.match(/build:\s*(\d+)/);

  if (buildMatch) {
    currentBuild = Number.parseInt(buildMatch[1], 10) || 0;
  }
}

const nextBuild = currentBuild + 1;
const builtAt = new Date().toISOString();

const output = `export const BUILD_META = {
  version: "${appVersion}",
  build: ${nextBuild},
  builtAt: "${builtAt}",
} as const;
`;

fs.writeFileSync(targetPath, output, "utf8");

console.log(`Build metadata updated: v${appVersion} - Build ${nextBuild}`);