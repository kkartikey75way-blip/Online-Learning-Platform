import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createAssignment,
  getAssignmentById,
  getModuleAssignment,
  submitAssignment,
  getMySubmission,
  getAssignmentSubmissions,
  gradeSubmission
} from "../controllers/assignment.controller";

const router = Router();

router.post("/create", authenticate, createAssignment);
router.get("/:assignmentId", authenticate, getAssignmentById);
router.get("/module/:moduleId", authenticate, getModuleAssignment);
router.post("/submit/:assignmentId", authenticate, submitAssignment);
router.get("/my-submission/:assignmentId", authenticate, getMySubmission);
router.get("/submissions/:assignmentId", authenticate, getAssignmentSubmissions);
router.post("/grade/:submissionId", authenticate, gradeSubmission);

export default router;
