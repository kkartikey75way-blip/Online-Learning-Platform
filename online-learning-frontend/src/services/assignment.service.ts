import { api } from "./api";

export const submitAssignment = async (
  assignmentId: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/assignments/submit/${assignmentId}`,
    formData
  );

  return res.data;
};
