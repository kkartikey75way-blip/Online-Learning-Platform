import { api } from "./api";

export const createLesson = async (
  data: any
) => {
  const res = await api.post("/lessons", data);
  return res.data;
};

export const getLessonsByModule = async (
  moduleId: string
) => {
  const res = await api.get(
    `/lessons/module/${moduleId}`
  );
  return res.data;
};
