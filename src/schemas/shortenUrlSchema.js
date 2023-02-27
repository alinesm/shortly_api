import joi from "joi";

export const urlSchema = joi.object({
  url: joi.string().min(3).uri().required(),
});

export default urlSchema;
