import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";
import { getInstructorStats } from "../controllers/instructor.controller";

const router = Router();

router.get(
  "/stats",
  authenticate,
  instructorOnly,
  getInstructorStats
);

export default router;
