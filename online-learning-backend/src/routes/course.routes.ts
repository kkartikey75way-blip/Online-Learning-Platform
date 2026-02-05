import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  getMyEnrolledCourses,
} from "../controllers/course.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);

router.post("/", authenticate, createCourse);
router.post("/:id/enroll", authenticate, enrollInCourse);
router.get("/me/enrolled", authenticate, getMyEnrolledCourses);

export default router;
