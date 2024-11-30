import { Router } from "express";
import validatorHandler from "../middlewares/validator.handler";
import {
  createTopicController,
  deleteTopicController,
  listTopicController,
  updateTopicController,
} from "../controllers/topic.controller";
import {
  createTopicValidation,
  getTopicByIdValidation,
  updateTopicValidation,
} from "../app/validations/topic.validation";

const router = Router();

router.get("/", listTopicController);

router.post(
  "/",
  validatorHandler(createTopicValidation, "body"),
  createTopicController
);

router.patch(
  "/:id",
  validatorHandler(getTopicByIdValidation, "params"),
  validatorHandler(updateTopicValidation, "body"),
  updateTopicController
);

router.delete(
  "/:id",
  validatorHandler(getTopicByIdValidation, "params"),
  deleteTopicController
);

export default router;
