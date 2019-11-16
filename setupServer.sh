#!/bin/bash
# Allows relative pathing
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

git pull
cd ./Cerveau
yarn
yarn start
cd ..
