import React from "react";
import { VideoRecommendation } from "../../../services/geminiVideo.service";

interface LessonFormProps {
    title: string;
    setTitle: (val: string) => void;
    videoUrl: string;
    setVideoUrl: (val: string) => void;
    loadingRecs: boolean;
    onGetSuggestions: () => void;
    recommendations: VideoRecommendation[];
    onCreateLesson: () => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({
    title,
    setTitle,
    videoUrl,
    setVideoUrl,
    loadingRecs,
    onGetSuggestions,
    recommendations,
    onCreateLesson,
}) => {
    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Add New Lesson</h4>

            <div className="flex gap-2 mb-2">
                <input
                    className="flex-1 border p-2 rounded focus:outline-none focus:border-indigo-500"
                    placeholder="Lesson title (e.g. Intro to React)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button
                    onClick={onGetSuggestions}
                    disabled={!title || loadingRecs}
                    className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded hover:bg-indigo-200 transition text-sm font-medium flex items-center gap-1"
                >
                    {loadingRecs ? "Searching..." : "✨ AI Suggest"}
                </button>
            </div>

            {recommendations.length > 0 && (
                <div className="mb-3 p-3 bg-white border border-indigo-100 rounded shadow-sm max-h-40 overflow-y-auto">
                    <p className="text-xs text-gray-500 mb-2">Select a video to auto-fill:</p>
                    {recommendations.map((vid, idx) => (
                        <div
                            key={idx}
                            onClick={() => setVideoUrl(vid.url)}
                            className="text-sm p-2 hover:bg-indigo-50 cursor-pointer rounded truncate flex justify-between group"
                        >
                            <span>{vid.title}</span>
                            <span className="text-indigo-500 opacity-0 group-hover:opacity-100 text-xs">Use</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <input
                    className="flex-[2] border p-2 rounded focus:outline-none focus:border-indigo-500"
                    placeholder="Video URL (YouTube)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                />
                <button
                    onClick={onCreateLesson}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded shadow-sm transition"
                >
                    Add Lesson
                </button>
            </div>
        </div>
    );
};
