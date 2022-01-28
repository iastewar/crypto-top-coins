import expressWinston from "express-winston";
import { createLogger, format, Logger, transports } from "winston";
import path from "path";

let appLogger: Logger = null;

export const getAppLogger = () => {
  return appLogger;
};

export const setupExpressLogger = (app: any) => {
  const expressTransports: any[] = [
    new transports.File({
      filename: path.join(process.cwd(), "logs", "request.log"),
      level: "info",
    }),
  ];

  if (process.env.NODE_ENV !== "production") {
    expressTransports.push(
      new transports.Console({
        level: "debug",
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.simple()
        ),
      })
    );
  }

  app.use(
    expressWinston.logger({
      format: format.combine(format.timestamp(), format.json()),
      transports: expressTransports,
    })
  );
};

export const setupAppLogger = () => {
  const appTransports: any[] = [
    new transports.File({
      filename: path.join(process.cwd(), "logs", "app.log"),
      level: "info",
    }),
  ];

  if (process.env.NODE_ENV !== "production") {
    appTransports.push(
      new transports.Console({
        level: "debug",
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.simple()
        ),
      })
    );
  }

  appLogger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: appTransports,
  });
};
