import { Request, Response, NextFunction } from "express";
import boom from "boom";
import { listTechStack } from "../app/services/tech-stack.service";

export const listTechStackController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topics = await listTechStack();
    res.json(topics);
  } catch (error: any) {
    next(boom.badRequest(error.message));
  }
};
