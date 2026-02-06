import { Router } from "express";
import {
  createLesson,
  getLessonsByModule,
} from "../controllers/lesson.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createLesson);
router.get("/module/:moduleId", getLessonsByModule);

export default router;
