import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getMyCertificates } from "../controllers/certificate.controller";

const router = Router();

router.get("/", authenticate, getMyCertificates);

export default router;
