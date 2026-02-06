import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  getMyEnrolledCourses,
  publishCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/course.controller";
import { authenticate } from "../middleware/auth.middleware";
import { instructorOnly } from "../middleware/role.middleware";

const router = Router();

router.get("/me/enrolled", authenticate, getMyEnrolledCourses);

router.delete("/:id", authenticate, instructorOnly, deleteCourse);
router.put("/:id", authenticate, instructorOnly, updateCourse);

router.patch(
  "/:id/publish",
  authenticate,
  instructorOnly,
  publishCourse
);

router.post("/:id/enroll", authenticate, enrollInCourse);

import { authenticateOptional } from "../middleware/auth.middleware";
router.get("/:id", authenticateOptional, getCourseById);
router.get("/", getAllCourses);
router.post("/", authenticate, createCourse);


export default router;
