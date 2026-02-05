import { Router } from "express";
import {
  createLesson,
  getLessonsByModule,
} from "../controllers/lesson.controller";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";
import { uploadVideo } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  instructorOnly,
  uploadVideo.single("video"),
  createLesson
);

router.get("/module/:moduleId", getLessonsByModule);

export default router;
