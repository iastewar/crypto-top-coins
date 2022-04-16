# Crypto Top Coins

Showcases the top crypto coins over time.

## Setup

Run ```npm install``` in both the client and server directories.

## Development

Run ```npm start``` in the client directory to start a development server for the react app. Run ```npm start-dev``` in the server directory to start a server. You should have both running at the same time (e.g. 2 seperate terminal windows).

## Build

Run ```sh build.sh```, then you can run the server (in server directory) with ```npm start```.

## Deploy

Deploy the server directory to Azure web app with the vscode extension (after building).

Can alternatively use the Dockerfile provided to deploy to something like cloud run (GCP)

## Update data

run ```node app.js``` in the cmc-scrapper directory. This will scrape coin market cap for all historical data.
