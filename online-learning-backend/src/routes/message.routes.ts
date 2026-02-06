import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    sendMessage,
    getConversation,
    getStudentConversations,
} from "../controllers/message.controller";

const router = Router();

// Student to Instructor or Vice Versa
router.post("/course/:courseId", authenticate, sendMessage);
router.get("/course/:courseId/with/:otherUserId", authenticate, getConversation);

// Instructor view of all conversations for a course
router.get("/course/:courseId/students", authenticate, getStudentConversations);

export default router;
