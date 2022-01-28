#!/bin/bash

# Builds both server and client and places the built client files in the server public folder
# The server is then ready to be deployed

cd server
npm run build
cd ../client
npm run build
cd ..
cp -a ./client/build/. ./server/public/
