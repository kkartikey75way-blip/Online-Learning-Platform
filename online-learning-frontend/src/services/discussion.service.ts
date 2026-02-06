import { api } from "./api";

export const getCoursePosts = async (courseId: string) => {
    const res = await api.get(`/discussions/course/${courseId}`);
    return res.data;
};

export const createPost = async (courseId: string, data: { title: string; content: string }) => {
    const res = await api.post(`/discussions/course/${courseId}`, data);
    return res.data;
};

export const getPostComments = async (postId: string) => {
    const res = await api.get(`/discussions/post/${postId}/comments`);
    return res.data;
};

export const createComment = async (postId: string, content: string) => {
    const res = await api.post(`/discussions/post/${postId}/comments`, { content });
    return res.data;
};
