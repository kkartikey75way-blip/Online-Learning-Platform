import { api } from "./api";

export const createAssignment = async (data: { moduleId: string; courseId: string; title: string; description: string }) => {
  const res = await api.post("/assignments/create", data);
  return res.data;
};

export const getModuleAssignment = async (moduleId: string) => {
  const res = await api.get(`/assignments/module/${moduleId}`);
  return res.data;
};

export const getAssignmentById = async (assignmentId: string) => {
  const res = await api.get(`/assignments/${assignmentId}`);
  return res.data;
};

export const submitAssignment = async (assignmentId: string, link: string) => {
  const res = await api.post(`/assignments/submit/${assignmentId}`, { link });
  return res.data;
};

export const getMySubmission = async (assignmentId: string) => {
  const res = await api.get(`/assignments/my-submission/${assignmentId}`);
  return res.data;
};

export const getAssignmentSubmissions = async (assignmentId: string) => {
  const res = await api.get(`/assignments/submissions/${assignmentId}`);
  return res.data;
};

export const gradeSubmission = async (submissionId: string, data: { grade: number; feedback: string }) => {
  const res = await api.post(`/assignments/grade/${submissionId}`, data);
  return res.data;
};
