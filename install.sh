#!/bin/bash

cd ./browserbook-mesh

go mod tidy

echo "No issues faced in the go packages"

cd ../client
if [ -f "node_modules" ]; then
  echo "re-using"
else
  nvm use

  npm install
fi

echo "good to run : make start"