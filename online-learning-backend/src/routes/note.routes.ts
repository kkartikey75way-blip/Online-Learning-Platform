import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { saveNote, getNote } from "../controllers/note.controller";

const router = Router();

router.post("/lesson/:lessonId", authenticate, saveNote);
router.get("/lesson/:lessonId", authenticate, getNote);

export default router;
