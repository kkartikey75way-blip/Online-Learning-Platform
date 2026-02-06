import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    getCourseProgress,
    markLessonComplete,
} from "../controllers/progress.controller";

const router = Router();

router.get("/course/:courseId", authenticate, getCourseProgress);
router.post("/complete", authenticate, markLessonComplete);

export default router;
