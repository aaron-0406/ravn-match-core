import express, { Express } from "express";

import topicRouter from "./topic.routes";
import techStackRouter from "./tech-stack.routes";
import teamMemberRouter from "./team-member.routes";

const routerApi = (app: Express) => {
  const router = express.Router();
  app.use("/api/v1", router);

  router.use("/topic", topicRouter);
  router.use("/tech-stack", techStackRouter);
  router.use("/team-member", teamMemberRouter);
};

export default routerApi;
