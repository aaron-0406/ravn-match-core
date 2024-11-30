import { Router } from "express";
import { listTechStackController } from "../controllers/tech-stack.controller";

const router = Router();

router.get("/", listTechStackController);

export default router;
