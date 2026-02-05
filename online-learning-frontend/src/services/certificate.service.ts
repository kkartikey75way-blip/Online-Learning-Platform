import { api } from "./api";

export const getMyCertificates = async () => {
  const res = await api.get("/certificates");
  return res.data;
};
