#!/bin/bash

cd ./browserbook-mesh

go mod tidy

echo "No issues faced in the go packages"

cd ../client

nvm use

npm install

echo "good to run : make start"