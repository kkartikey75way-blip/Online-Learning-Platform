import { Router } from "express";
import { register, login, verifyEmail, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { googleAuth } from "../controllers/googleAuth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.post("/google", googleAuth);
router.get("/me", authenticate, getMe);

export default router;
