import { Router } from "express";
import { createLesson } from "../controllers/lesson.controller";
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

export default router;
