import { api } from "./api";

export const createLesson = async (
  formData: FormData
) => {
  const res = await api.post("/lessons", formData);
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
