import express from "express";
import path from "path";
import { setupAppLogger, setupExpressLogger } from "./logging";

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

const startServer = () => {
  const server = app.listen(port, () => {
    return console.log(`server is listening on port ${port}`)
  })

  // remove server timeout if needed
  // server.setTimeout(0)
}

const main = () => {
  setupExpressLogger(app);
  setupAppLogger();

  // if you need an api key
  // app.use((req, res, next) => {
  //   if (req.headers['x-api-key'] !== apiKey) {
  //     return res.status(403).send('Invalid API key');
  //   }

  //   next();
  // });

  app.use(express.static(path.join(process.cwd(), "public")));

  // test route
  app.get("/test", (req, res) => {
    res.json({ test: "hi" });
  });
  
  app.use((req, res, next) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
  });

  startServer();
}

main();
