#!/bin/bash

echo "Starting docker build"

cd ./client
docker build . -t browserbook
docker run -p 8080:5500 -d browserbook

echo "Docker Image Created"