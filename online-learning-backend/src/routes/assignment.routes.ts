import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { uploadVideo } from "../middleware/upload.middleware";
import { submitAssignment } from "../controllers/assignment.controller";

const router = Router();

router.post(
  "/submit/:assignmentId",
  authenticate,
  uploadVideo.single("file"),
  submitAssignment
);

export default router;
