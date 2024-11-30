import Joi from "joi";

const id = Joi.number();
const name = Joi.string();

export const getTopicByIdValidation = Joi.object<{ id: number }, true>({
  id: id.required(),
});

export const createTopicValidation = Joi.object({
  name: name.required(),
});

export const updateTopicValidation = Joi.object({
  name: name.required(),
});
