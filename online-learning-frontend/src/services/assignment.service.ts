import { api } from "./api";

export const submitAssignment = async (
  assignmentId: string,
  fileUrl: string
) => {
  const res = await api.post(
    `/assignments/submit/${assignmentId}`,
    { fileUrl }
  );

  return res.data;
};
