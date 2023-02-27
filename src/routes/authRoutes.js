import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import userSchema from "../schemas/userSchema.js";
import {
  signInBodyValidation,
  validateSchema,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", validateSchema(userSchema), signUp);
router.post("/signin", signInBodyValidation, signIn);

export default router;
