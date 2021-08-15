#!/usr/bin/env bash

export P2P_BIND_ADDRS="/ip4/0.0.0.0/tcp/4001,/ip4/0.0.0.0/tcp/4002/ws"

export P2P_ADVERTISE_ADDRS="/ip4/34.136.24.16/tcp/4001,/ip4/34.136.24.16/tcp/4002/ws"
export USE_BOOTSTRAP_LIST="false"

echo $(pwd)

cd cmd/bootstrap

go run . > config.log