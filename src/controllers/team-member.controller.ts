import { Request, Response, NextFunction } from "express";
import boom from "boom";
import { listTechStack } from "../app/services/tech-stack.service";
import { listTeamMember } from "../app/services/team-member.service";

export const listTeamMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requiredSeniority, requiredEnglishLevel, topics, techStack } = req.body;
    const teamMembers = await listTeamMember(requiredSeniority, requiredEnglishLevel, topics, techStack);
    res.json(teamMembers);
  } catch (error: any) {
    next(boom.badRequest(error.message));
  }
};
