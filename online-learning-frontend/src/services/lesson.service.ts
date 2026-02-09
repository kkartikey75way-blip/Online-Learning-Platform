import { api } from "./api";
import { CreateLessonData } from "../types/service-data";

export const createLesson = async (
  data: CreateLessonData
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
