import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getTranslationStatus, translateAudio } from "../controllers/translationController.js";

const router = Router();
router.use(requireAuth);

router.get("/status", getTranslationStatus);
router.post("/translate", translateAudio);

export default router;
