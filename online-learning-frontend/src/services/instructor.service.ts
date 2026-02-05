import { api } from "./api";

export const getInstructorStats = async () => {
  const res = await api.get("/instructor/stats");
  return res.data;
};
