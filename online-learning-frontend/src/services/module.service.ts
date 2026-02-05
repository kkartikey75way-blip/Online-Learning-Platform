import { api } from "./api";

export const createModule = async (
  title: string,
  courseId: string
) => {
  const res = await api.post("/modules", {
    title,
    courseId,
  });
  return res.data;
};

export const getModulesByCourse = async (
  courseId: string
) => {
  const res = await api.get(
    `/modules/course/${courseId}`
  );
  return res.data;
};
