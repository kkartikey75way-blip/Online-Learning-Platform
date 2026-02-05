import { api } from "./api";

export const getQuizByLesson = async (lessonId: string) => {
  const res = await api.get(`/quizzes/${lessonId}`);
  return res.data;
};
