import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "test") {
  import("./src/common/config/db-connect");
}

import express, { Express } from "express";

import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";

import timeout from "connect-timeout";

const app: Express = express();
import morgan from "morgan";
import cors from "cors";

import { errorLogger, errorResponder } from "./src/common/middlewares/errors";
import { stream } from "./src/common/config/winston";

app.enable("trust proxy");
app.use(timeout("2.5s"));
app.use(cors());
app.use(
  morgan(
    // Standard Apache combined log output plus response time
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
    { stream }
  )
);
app.use(express.json());

import userRouter from "./src/users/users.route";
import addressRouter from "./src/addresses/addresses.route";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorLogger);
app.use(errorResponder);

export default app;
