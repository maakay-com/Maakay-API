import winston from "winston";
import Sentry from "winston-transport-sentry-node";

// define the custom settings for each transport (file, console)
const options = {
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
  sentry: {
    level: "error",
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console),
    new Sentry(options.sentry),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

export const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};

export default logger;
