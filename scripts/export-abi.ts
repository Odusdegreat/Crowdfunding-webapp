import fs from "node:fs";
import path from "node:path";

const CONTRACT_NAME = "Crowdfunding";

// adjust if your frontend folder name is different
const FRONTEND_DIR = path.join(process.cwd(), "frontend", "src", "contracts");

function main() {
  const artifactPath = path.join(
    process.cwd(),
    "artifacts",
    "contracts",
    `${CONTRACT_NAME}.sol`,
    `${CONTRACT_NAME}.json`,
  );

  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found. Compile first: ${artifactPath}`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const abi = artifact.abi;

  fs.mkdirSync(FRONTEND_DIR, { recursive: true });

  fs.writeFileSync(
    path.join(FRONTEND_DIR, "abi.ts"),
    `export const CROWDFUNDING_ABI = ${JSON.stringify(abi, null, 2)} as const;\n`,
    "utf-8",
  );

  console.log("✅ ABI exported to frontend/src/contracts/abi.ts");
}

main();
