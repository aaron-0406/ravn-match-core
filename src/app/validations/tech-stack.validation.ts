import Joi from "joi";

const id = Joi.number();

export const getTechStackByIdValidation = Joi.object<{ id: number }, true>({
  id: id.required(),
});
