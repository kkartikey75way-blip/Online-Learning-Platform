import { Router } from "express";
import {
  createLesson,
  getLessonsByModule,
} from "../controllers/lesson.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("video"),
  createLesson
);

router.get(
  "/module/:moduleId",
  authenticate,
  getLessonsByModule
);

export default router;
