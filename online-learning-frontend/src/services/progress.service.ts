import { api } from "./api";

export const markLessonComplete = async (
  courseId: string,
  lessonId: string
) => {
  const res = await api.post("/progress/complete", {
    courseId,
    lessonId,
  });
  return res.data;
};

export const getProgress = async (courseId: string) => {
  const res = await api.get(`/progress/${courseId}`);
  return res.data;
};
