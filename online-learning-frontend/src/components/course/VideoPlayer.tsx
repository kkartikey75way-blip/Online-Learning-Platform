import React from "react";
import { HiOutlinePlayCircle } from "react-icons/hi2";
import { Lesson } from "../../types/course.types";

interface VideoPlayerProps {
    lesson: Lesson | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson }) => {
    if (!lesson) {
        return (
            <div className="text-gray-400 flex flex-col items-center">
                <HiOutlinePlayCircle size={64} />
                <p className="mt-4 text-lg">Select a lesson to start</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center bg-black">
                {lesson.videoUrl ? (
                    lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be") ? (
                        <iframe
                            src={lesson.videoUrl.replace("watch?v=", "embed/")}
                            title={lesson.title}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    ) : (
                        <video src={lesson.videoUrl} controls className="max-h-full max-w-full" autoPlay />
                    )
                ) : (
                    <div className="text-gray-500 flex flex-col items-center">
                        <HiOutlinePlayCircle size={64} />
                        <p className="mt-4">No video available</p>
                    </div>
                )}
            </div>
        </div>
    );
};
