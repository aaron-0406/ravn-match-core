import express, { Express } from "express";

import topicRouter from "./topic.routes";

const routerApi = (app: Express) => {
  const router = express.Router();
  app.use("/api/v1", router);

  router.use("/topic", topicRouter);
};

export default routerApi;
