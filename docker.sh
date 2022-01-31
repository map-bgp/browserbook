#!/bin/bash

echo "Starting docker build"

cd ./client
docker build . -t ankan0011/browserbook
docker run -p 8080:5500 -d ankan0011/browserbook

echo "Docker Image Created"
