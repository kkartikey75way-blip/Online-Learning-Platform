import { api } from "./api";

export const getLessonsByModule = async (moduleId: string) => {
  const res = await api.get(`/lessons/module/${moduleId}`);
  return res.data;
};
