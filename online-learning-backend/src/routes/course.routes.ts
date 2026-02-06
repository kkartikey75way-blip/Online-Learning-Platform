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
  getCoursesByInstructor,
  getRecommendedCourses,
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
router.get("/recommendations", authenticate, getRecommendedCourses);

import { authenticateOptional } from "../middleware/auth.middleware";
router.get("/instructor/:instructorId", getCoursesByInstructor);
router.get("/:id", authenticateOptional, getCourseById);
router.get("/", getAllCourses);
router.post("/", authenticate, createCourse);


export default router;
