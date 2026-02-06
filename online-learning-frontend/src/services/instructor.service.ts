import { api } from "./api";

export const getInstructorStats = async () => {
  const res = await api.get("/instructor/stats");
  return res.data;
};

export const getCourseStudentAnalytics = async (courseId: string) => {
  const res = await api.get(`/instructor/course/${courseId}/analytics`);
  return res.data;
};
