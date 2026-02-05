import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { submitAssignment } from "../controllers/assignment.controller";

const router = Router();

router.post(
  "/submit/:assignmentId",
  authenticate,
  upload.single("file"),
  submitAssignment
);

export default router;
