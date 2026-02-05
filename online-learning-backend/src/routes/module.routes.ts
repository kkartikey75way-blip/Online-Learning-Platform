import { Router } from "express";
import {
  createModule,
  getModulesByCourse,
} from "../controllers/module.controller";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, instructorOnly, createModule);
router.get(
  "/course/:courseId",
  authenticate,
  getModulesByCourse
);

export default router;
