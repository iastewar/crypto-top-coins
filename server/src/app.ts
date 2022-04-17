import express from "express";
import path from "path";
import compression from "compression";
import { readFile } from "fs-extra";

const app = express();
app.use(express.json());
app.use(compression());
const port = process.env.PORT || 8080;

const startServer = () => {
  const server = app.listen(port, () => {
    return console.log(`server is listening on port ${port}`);
  });
};

const main = () => {
  app.use(express.static(path.join(process.cwd(), "public")));

  app.get("/cmc-data", async (req, res) => {
    const data = await readFile(
      path.join(process.cwd(), "data", "cmc-data.json"),
      "utf-8"
    );
    res.json(JSON.parse(data));
  });

  app.use((req, res, next) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
  });

  startServer();
};

main();
