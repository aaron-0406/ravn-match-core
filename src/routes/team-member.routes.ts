import { Router } from "express";
import { listTeamMemberController } from "../controllers/team-member.controller";

const router = Router();

router.post("/", listTeamMemberController);

export default router;
