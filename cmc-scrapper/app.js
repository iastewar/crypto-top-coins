const puppeteer = require("puppeteer");
const fs = require("fs");
const dayjs = require("dayjs");
const accounting = require('accounting-js');

const baseUrl = "https://coinmarketcap.com";

/**
 * returns a list of urls (first day of every month)
 */
const getHistoricalUrls = async (page) => {
  await page.goto(`${baseUrl}/historical/`);
  const urls = await page.evaluate(() => {
    const res = [];
    const rows = document.querySelectorAll("div.row > div");
    for (const row of rows) {
      const url = row.querySelector("a").getAttribute("href");
      res.push(url);
    }

    return res;
  });

  return urls;
};

/**
 * gets data for one url date
 */
const getDateData = async (page, url) => {
  const dateDayjs = dayjs(url.split("/")[2], "YYYYMMDD");
  const year = dateDayjs.year();
  const month = dateDayjs.month() + 1;

  await page.goto(`${baseUrl}${url}`);
  const dateData = await page.evaluate(
    (year, month) => {
      const res = [];
      const rows = document.querySelectorAll("table tbody tr");
      for (const row of rows) {
        const rankElement = row.querySelector("td:nth-child(1)");
        const nameElement = row.querySelector("td:nth-child(2)");
        const symbolElement = row.querySelector("td:nth-child(3)");
        const marketCapElement = row.querySelector("td:nth-child(4)");

        if (
          !rankElement ||
          !nameElement ||
          !symbolElement ||
          !marketCapElement
        ) {
          // keep looping until the rows do not contain data (note: this happens to be on the 20th row)
          break;
        }

        res.push({
          year: year,
          month: month,
          rank: parseInt(rankElement.innerText),
          name: nameElement.innerText,
          symbol: symbolElement.innerText,
          marketCap: marketCapElement.innerText,
        });
      }

      return res;
    },
    year,
    month
  );

  return dateData.map(e => {
    e.marketCap = accounting.unformat(e.marketCap);
    return e;
  });
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log("getting urls");
  const urls = await getHistoricalUrls(page);

  let data = [];
  for (const url of urls) {
    console.log(`getting data for url ${url}`);
    const dateData = await getDateData(page, url);
    data = [...data, ...dateData];
  }

  fs.writeFileSync("../server/data/cmc-data.json", JSON.stringify(data), {
    encoding: "utf-8",
  });

  await browser.close();
})();
