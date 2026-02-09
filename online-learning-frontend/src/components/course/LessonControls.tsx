import React from "react";
import { HiArrowSmallLeft, HiArrowSmallRight, HiOutlineCheckCircle } from "react-icons/hi2";
import { Lesson } from "../../types/course.types";

interface LessonControlsProps {
    activeLesson: Lesson;
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
    progress: number;
    isCompleted: boolean;
    onComplete: () => void;
    onClaimCertificate: () => void;
}

export const LessonControls: React.FC<LessonControlsProps> = ({
    activeLesson,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
    progress,
    isCompleted,
    onComplete,
    onClaimCertificate,
}) => {
    return (
        <div className="bg-white p-6 border-t flex justify-between items-start shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeLesson.title}</h2>
                <p className="text-gray-600 max-w-2xl">{activeLesson.content || "No description available for this lesson."}</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className={`p-3 rounded-lg border transition ${!hasPrev ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 active:scale-95"}`}
                    title="Previous Lesson"
                >
                    <HiArrowSmallLeft size={20} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`p-3 rounded-lg border transition ${!hasNext ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 active:scale-95"}`}
                    title="Next Lesson"
                >
                    <HiArrowSmallRight size={20} />
                </button>
            </div>

            <div className="flex gap-3">
                {Math.round(progress) === 100 && (
                    <button
                        onClick={onClaimCertificate}
                        className="px-6 py-3 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 shadow-md transition flex items-center gap-2"
                    >
                        🏆 Claim Certificate
                    </button>
                )}
                <button
                    onClick={onComplete}
                    disabled={isCompleted}
                    className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${isCompleted
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                        }`}
                >
                    {isCompleted ? (<>Completed <HiOutlineCheckCircle /></>) : "Mark Complete"}
                </button>
            </div>
        </div>
    );
};
