#!/bin/bash

while [[ $# -gt 0 ]]; do
    switch="$1"

    case $switch in
        -h|--host)
        HOST="$2"
        shift
        shift
        ;;
        -p|--port)
        PORT="$2"
        shift
        shift
        ;;
    esac
done

if [ -z "$HOST" ]; 
then
    HOST="127.0.0.1"
else 
    echo "$HOST is configured"
fi

if [ -z "$PORT"]; then
    PORT="5500"
else 
    echo "$PORT is configured"
fi

ganache-cli -h $HOST -p 9545 -m "hawk myth suggest very kitten fine ketchup message pulse fuel field muscle" -e 500  --networkId 4447 &

cd ./browserbook-mesh

GOOS=js GOARCH=wasm go build -o ../client/src/wasm/main.wasm

sleep 3

echo "Wasm Created"

cd ../client

npm run dev -- --host=$HOST --port=$PORT