import { Router } from "express";
import {
  createShortUrl,
  deleteUrl,
  getOpenShorten,
  getUrlById,
  getUserHistory,
  listRanking,
} from "../controllers/shortenUrlController.js";
import {
  authRoutesValidation,
  validateSchema,
} from "../middlewares/authMiddleware.js";
import shortenUrlSchema from "../schemas/shortenUrlSchema.js";

const router = Router();

router.get("/urls/open/:shortUrl", getOpenShorten);
router.get("/urls/:id", getUrlById);
router.get("/ranking", listRanking);

router.use(authRoutesValidation);
router.post("/urls/shorten", validateSchema(shortenUrlSchema), createShortUrl);
router.delete("/urls/:id", deleteUrl);
router.get("/users/me", getUserHistory);

export default router;
