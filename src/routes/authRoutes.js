import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { userSchema, loginSchema } from "../schemas/userSchema.js";
import { validateSchema } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", validateSchema(userSchema), signUp);
router.post("/signin", validateSchema(loginSchema), signIn);

export default router;
