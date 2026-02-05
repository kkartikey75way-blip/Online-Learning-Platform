import { Router } from "express";
import { createLesson } from "../controllers/lesson.controller";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  instructorOnly,
  upload.single("file"),
  createLesson
);


export default router;
