import { Router } from "express";
import {
  createLesson,
  getLessonsByModule,
} from "../controllers/lesson.controller";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, instructorOnly, createLesson);
router.get("/module/:moduleId", getLessonsByModule);

export default router;
