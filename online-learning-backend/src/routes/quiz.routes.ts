import { Router } from "express";
import { createQuiz, submitQuiz } from "../controllers/quiz.controller";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, instructorOnly, createQuiz);
router.post("/submit", authenticate, submitQuiz);

export default router;
