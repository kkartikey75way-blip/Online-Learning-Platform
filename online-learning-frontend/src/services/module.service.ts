import { api } from "./api";

export const getModulesByCourse = async (courseId: string) => {
  const res = await api.get(`/modules/course/${courseId}`);
  return res.data;
};
