import { api } from "./api";

export const getAllCourses = async () => {
  const res = await api.get("/courses");
  return res.data;
};

export const getCourseById = async (id: string) => {
  const res = await api.get(`/courses/${id}`);
  return res.data;
};

export const enrollCourse = async (courseId: string) => {
  const res = await api.post(`/courses/${courseId}/enroll`);
  return res.data;
};
export const getMyEnrolledCourses = async () => {
  const res = await api.get("/courses/enrolled");
  return res.data;
};