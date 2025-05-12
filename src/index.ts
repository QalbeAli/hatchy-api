import { config } from "dotenv";
config();
import express, { json } from "express";
import cors from "cors";
import cron from 'node-cron';

import { errorHandler } from "./middlewares/error-handler";
import { RegisterRoutes } from "./tsoa/routes";
import swaggerDocument from "./tsoa/swagger.json";
import swaggerUI from "swagger-ui-express";
import { notFoundHandler } from "./middlewares/not-found-route-handler";
import { transformTimestampMiddleware } from "./middlewares/transform-timestamp-middleware";

const app = express();
const PORT = process.env.PORT || 3000;

export const init = (async () => {

  app.use(json());
  app.use(cors());
  app.use(transformTimestampMiddleware);
  RegisterRoutes(app);
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server Listening on PORT: ${PORT} http://localhost:${PORT}`);
  });
})();
