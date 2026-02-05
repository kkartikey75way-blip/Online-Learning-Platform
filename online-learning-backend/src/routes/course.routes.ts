import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  getMyEnrolledCourses,
  publishCourse,
} from "../controllers/course.controller";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";

const router = Router();

router.get("/me/enrolled", authenticate, getMyEnrolledCourses);

router.patch(
  "/:id/publish",
  authenticate,
  instructorOnly,
  publishCourse
);

router.post("/:id/enroll", authenticate, enrollInCourse);

router.get("/:id", getCourseById);
router.get("/", getAllCourses);
router.post("/", authenticate, createCourse);


export default router;
