import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export interface VideoRecommendation {
    title: string;
    url: string;
}

export const fetchLessonVideos = async (
    lessonHeading: string
): Promise<VideoRecommendation[]> => {
    const res = await axios.get(`${API_BASE_URL}/ai/videos`, {
        params: { heading: lessonHeading },
        withCredentials: true,
    });

    return res.data.videos;
};
