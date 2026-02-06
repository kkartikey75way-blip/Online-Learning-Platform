import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { submitAssignment } from "../controllers/assignment.controller";

const router = Router();

router.post(
  "/submit/:assignmentId",
  authenticate,
  submitAssignment
);

export default router;
