import { Router } from "express";
import { markLessonComplete } from "../controllers/progress.controller";
import { authenticate } from "../middleware/auth.middleware";
import { studentOnly } from "../middleware/student.middleware";

const router = Router();

router.post(
  "/complete",
  authenticate,
  studentOnly,
  markLessonComplete
);

export default router;
