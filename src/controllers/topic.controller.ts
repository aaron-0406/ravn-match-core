import { Request, Response, NextFunction } from "express";
import boom from "boom";
import {
  createTopic,
  deleteTopic,
  listTopics,
  updateTopic,
} from "../app/services/topic.service";

export const listTopicController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topics = await listTopics();

    res.json(topics);
  } catch (error: any) {
    next(boom.badRequest(error.message));
  }
};

export const createTopicController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const topic = await createTopic(name);

    res.json(topic);
  } catch (error: any) {
    next(boom.badRequest(error.message));
  }
};

export const updateTopicController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const idNumber = parseInt(id);
    const topic = await updateTopic(idNumber, name);

    res.json(topic);
  } catch (error: any) {
    next(boom.badRequest(error.message));
  }
};

export const deleteTopicController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const idNumber = parseInt(id);
    const idtopic = await deleteTopic(idNumber);

    res.json(idtopic);
  } catch (error: any) {
    next(boom.badRequest(error.message));
  }
};
