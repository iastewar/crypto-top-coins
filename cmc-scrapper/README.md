# Coin Market Cap Scrapper

Scrapes the coin market cap historcal data pages for the top 20 coins by market cap for every week (2013-present)
and outputs the coin rank, name, ticker symbol, market cap, etc. in a json file. Saves the file in the ../server/data directory as cmc-data.json.

To keep the data up to date, this should be ran every week (e.g. a cron job).

## Install

```npm i```

## Run

```node app.js```
