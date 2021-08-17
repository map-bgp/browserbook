cd ./browserbook-mesh

GOOS=js GOARCH=wasm go build -o ../client/src/wasm/main.wasm

sleep 3

echo "Wasm Created"

cd ../client

npm run dev