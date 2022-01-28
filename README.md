# Crypto Top Coins

Showcases the top 20 crypto coins over time.

## Setup

Run ```npm install``` in both the client and server directories.

## Development

Run ```npm start``` in the client directory to start a development server for the react app. Run ```npm start-dev``` in the server directory to start a server. You should have both running at the same time (e.g. 2 seperate terminal windows).

## Build

Run ```sh build.sh```, then you can run the server (in server directory) with ```npm start```.

## Deploy

Deploy the server directory to Azure with the vscode extension (after building).

## Docker example

### Build and push (local)

docker build -t something.azurecr.io/project:1.0.0 .

docker login something.azurecr.io

docker push something.azurecr.io/project:1.0.0

### Pull and start (VM)

docker login something.azurecr.io

docker pull something.azurecr.io/project:1.0.0

docker stop project

docker rm project

docker run -d -p 5000:5000 --restart=always --name=project something.azurecr.io/project:1.0.0

(Note: can use -v to mount directories such as logs e.g. -v /home/user/project/logs:/project/logs)
