import { Router } from "express";
import { submitAssignment } from "../controllers/assignment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/submit",
  authenticate,
  upload.single("file"),
  submitAssignment
);

export default router;
