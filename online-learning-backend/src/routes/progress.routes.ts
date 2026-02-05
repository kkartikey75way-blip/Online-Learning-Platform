import { Router } from "express";
import { markComplete } from "../controllers/progress.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/complete", authenticate, markComplete);

export default router;
