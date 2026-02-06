import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    createPost,
    getCoursePosts,
    createComment,
    getPostComments,
} from "../controllers/discussion.controller";

const router = Router();

router.post("/course/:courseId", authenticate, createPost);
router.get("/course/:courseId", authenticate, getCoursePosts);
router.post("/post/:postId/comments", authenticate, createComment);
router.get("/post/:postId/comments", authenticate, getPostComments);

export default router;
