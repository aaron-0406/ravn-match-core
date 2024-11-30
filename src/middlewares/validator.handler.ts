import boom from "boom";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validatorHandler = (
  schema: Joi.ObjectSchema,
  property: "params" | "body" | "query"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) return next(boom.badRequest(error.message));
    next();
  };
};

export default validatorHandler;
