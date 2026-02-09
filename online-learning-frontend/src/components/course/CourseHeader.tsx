import React from "react";

interface CourseHeaderProps {
    title: string;
    progress: number;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ title, progress }) => {
    return (
        <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
            <h1 className="text-xl font-bold text-indigo-900 truncate flex-1 mr-4">
                {title}
            </h1>
            <div className="flex items-center gap-4 shrink-0">
                <div className="text-sm font-medium text-gray-500">
                    {Math.round(progress)}% Complete
                </div>
                <div className="w-32 bg-gray-200 h-2 rounded-full hidden sm:block">
                    <div
                        className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
