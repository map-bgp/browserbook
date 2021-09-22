import * as fs from "fs";
import * as path from "path";

const contractsRoot = "./abi";

export function fetchABI(contractName: string) {
  const contractArtifact = fs.readFileSync(
    path.join(__dirname, contractsRoot, `${contractName}.json`),
    "utf-8"
  );
  const parsedArtifact = JSON.parse(contractArtifact);
  try {
    return parsedArtifact.abi;
  } catch {
    throw new Error("abi doesnt exist on the particular contract name");
  }
}


