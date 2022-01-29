const puppeteer = require("puppeteer");
const fs = require("fs");
const dayjs = require("dayjs");
const accounting = require("accounting-js");

const BASE_URL = "https://coinmarketcap.com";
const TOP = 10;

/**
 * returns a list of urls (first day of every month)
 */
const getHistoricalUrls = async (page) => {
  await page.goto(`${BASE_URL}/historical/`);
  const urls = await page.evaluate(() => {
    const res = [];
    const rows = document.querySelectorAll("div.row > div");
    for (const row of rows) {
      const aTags = row.querySelectorAll("a");
      for (const aTag of aTags) {
        const url = aTag.getAttribute("href");
        res.push(url);
      }
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
  const day = dateDayjs.date();

  await page.goto(`${BASE_URL}${url}`);
  await autoScroll(page); // load all content

  const dateData = await page.evaluate(
    (year, month, day, TOP) => {
      const res = [];
      const rows = document.querySelectorAll("table tbody tr");
      let end = rows.length;
      if (end > TOP) end = TOP;

      for (let i = 0; i < end; i++) {
        const row = rows[i]
        const rankElement = row.querySelector("td:nth-child(1)");
        const nameElement = row.querySelector("td:nth-child(2)");
        const symbolElement = row.querySelector("td:nth-child(3)");
        const marketCapElement = row.querySelector("td:nth-child(4)");

        const imgSrc = nameElement.querySelector("img").getAttribute("src");

        res.push({
          year: year,
          month: month,
          day: day,
          rank: parseInt(rankElement.innerText),
          name: nameElement.innerText,
          symbol: symbolElement.innerText,
          marketCap: marketCapElement.innerText,
          imgSrc: imgSrc,
        });
      }

      return res;
    },
    year,
    month,
    day,
    TOP
  );

  return dateData.map((e) => {
    e.marketCap = accounting.unformat(e.marketCap);
    return e;
  });
};

/**
 * scrolls to the bottom of the page
 */
const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 5);
    });
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
