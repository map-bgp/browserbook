cd ./browserbook-mesh/cmd/bootstrap/


export P2P_BIND_ADDRS="/ip4/0.0.0.0/tcp/60501,/ip4/0.0.0.0/tcp/60500/ws"

export P2P_ADVERTISE_ADDRS="/ip4/192.41.136.236/tcp/60501,/ip4/192.41.136.236/tcp/60500/ws"
export USE_BOOTSTRAP_LIST="false"

echo $(pwd)

go run .

