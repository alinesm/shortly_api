import joi from "joi";

// export const userSchema = joi.object({
//   name: joi.string().min(3).required(),
//   email: joi.string().email().required(),
//   password: joi.string().min(6).required()
// })

export const userSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
});

// export const loginSchema = joi.object({
//   email: joi.string().email().required(),
//   password: joi.string().required(),
// });

export default userSchema;
