import { useEffect, useState } from "react";
import { fetchLessonVideos, VideoRecommendation } from "../services/geminiVideo.service";

interface Props {
    lessonTitle: string;
}

const LessonVideoRecommendations = ({ lessonTitle }: Props) => {
    const [videos, setVideos] = useState<VideoRecommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lessonTitle) return;

        setLoading(true);
        fetchLessonVideos(lessonTitle)
            .then(setVideos)
            .finally(() => setLoading(false));
    }, [lessonTitle]);

    if (loading) return <p>🔄 Loading recommended videos...</p>;
    if (!videos.length) return <p>No video recommendations available</p>;

    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">
                🎥 Recommended Videos
            </h3>

            <ul className="space-y-3">
                {videos.map((video, idx) => (
                    <li
                        key={idx}
                        className="border rounded-lg p-4 hover:shadow transition"
                    >
                        <p className="font-medium">{video.title}</p>
                        <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm"
                        >
                            Watch on YouTube →
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LessonVideoRecommendations;
