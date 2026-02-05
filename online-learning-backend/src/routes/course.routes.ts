import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  getMyEnrolledCourses
} from "../controllers/course.controller";

import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";
import { studentOnly } from "../middleware/student.middleware";

const router = Router();

// public
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// instructor
router.post("/", authenticate, instructorOnly, createCourse);

// student
router.post(
  "/:id/enroll",
  authenticate,
  studentOnly,
  enrollInCourse
);
router.get(
  "/enrolled",
  authenticate,
  getMyEnrolledCourses
);


export default router;
