import { Router } from "express";
import { register, login, verifyEmail } from "../controllers/auth.controller";
import { googleAuth } from "../controllers/googleAuth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.post("/google", googleAuth);

export default router;
