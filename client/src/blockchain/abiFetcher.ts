import * as fs from "fs";
import * as path from "path";

const contractsRoot = "../../build/contracts/";

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

export function fetchJSONFile(contractName: string, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4 || httpRequest.status === 0) {
          if (httpRequest.status === 200) {
              var data = JSON.parse(httpRequest.responseText);
              if (callback) callback(data);
          }
      }
  };
  httpRequest.open('GET',  path.join(__dirname, contractsRoot, `${contractName}.json`));
  httpRequest.send(); 
}
