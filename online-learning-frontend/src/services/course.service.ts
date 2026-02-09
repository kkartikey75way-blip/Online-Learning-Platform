import { api } from "./api";
import { UpdateCourseData } from "../types/service-data";

export const getAllCourses = async () => {
  const res = await api.get("/courses");
  return res.data;
};

export const getCourseById = async (id: string) => {
  const res = await api.get(`/courses/${id}`);
  return res.data;
};

export const enrollInCourse = async (courseId: string) => {
  const res = await api.post(`/courses/${courseId}/enroll`);
  return res.data;
};

export const getMyEnrolledCourses = async () => {
  const res = await api.get("/courses/me/enrolled");
  return res.data;
};

export const getCoursesByInstructor = async (instructorId: string) => {
  const res = await api.get(`/courses/instructor/${instructorId}`);
  return res.data;
};

export const deleteCourse = async (id: string) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};

export const updateCourse = async (id: string, data: UpdateCourseData) => {
  const res = await api.put(`/courses/${id}`, data);
  return res.data;
};

export const getRecommendedCourses = async () => {
  const res = await api.get("/courses/recommendations");
  return res.data;
};
