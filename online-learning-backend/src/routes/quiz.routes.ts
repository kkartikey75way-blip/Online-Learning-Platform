import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";
import {
  createQuiz,
  getQuizByLesson,
} from "../controllers/quiz.controller";

const router = Router();

router.post("/", authenticate, instructorOnly, createQuiz);
router.get("/:lessonId", authenticate, getQuizByLesson);

export default router;
