import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";
import { getInstructorStats, getCourseStudentAnalytics } from "../controllers/instructor.controller";

const router = Router();

router.get(
  "/stats",
  authenticate,
  instructorOnly,
  getInstructorStats
);

router.get(
  "/course/:courseId/analytics",
  authenticate,
  instructorOnly,
  getCourseStudentAnalytics
);

export default router;
