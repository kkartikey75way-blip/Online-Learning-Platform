import React from "react";
import { HiChevronDown, HiChevronUp, HiOutlineCheckCircle, HiOutlineLockClosed, HiOutlinePlayCircle, HiOutlineDocumentText } from "react-icons/hi2";
import { Module, Lesson, Course } from "../../types/course.types";

interface CurriculumSidebarProps {
    modules: Module[];
    expandedModules: Set<string>;
    toggleModule: (id: string) => void;
    activeLesson: Lesson | null;
    setActiveLesson: (lesson: Lesson) => void;
    completedLessons: Set<string>;
    courseData: Course;
    onAssignmentClick: (moduleId: string) => void;
    activeTab: string;
    activeModuleId: string | null;
    isInstructor: boolean;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
    modules,
    expandedModules,
    toggleModule,
    activeLesson,
    setActiveLesson,
    completedLessons,
    courseData,
    onAssignmentClick,
    activeTab,
    activeModuleId,
    isInstructor,
}) => {
    return (
        <div>
            <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-bold text-gray-800">Course Content</h3>
                <p className="text-xs text-gray-500">{modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons</p>
            </div>
            {modules.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                    <p>No modules found.</p>
                </div>
            ) : modules.map((module, moduleIndex) => (
                <div key={module._id} className="border-b last:border-none">
                    <button
                        onClick={() => toggleModule(module._id)}
                        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                        <span className="font-semibold text-gray-800 text-left text-sm">{module.title}</span>
                        {expandedModules.has(module._id) ? <HiChevronUp /> : <HiChevronDown />}
                    </button>

                    {expandedModules.has(module._id) && (
                        <div className="bg-gray-50">
                            {module.lessons.map((lesson, lessonIndex) => {
                                let isLocked = lesson.isLocked && !completedLessons.has(lesson._id);

                                if (courseData?.dripEnabled && !isInstructor) {
                                    if (lessonIndex > 0) {
                                        const prevLesson = module.lessons[lessonIndex - 1];
                                        if (!completedLessons.has(prevLesson._id)) {
                                            isLocked = true;
                                        }
                                    } else if (moduleIndex > 0) {
                                        const prevModule = modules[moduleIndex - 1];
                                        const lastLessonOfPrevModule = prevModule.lessons[prevModule.lessons.length - 1];
                                        if (lastLessonOfPrevModule && !completedLessons.has(lastLessonOfPrevModule._id)) {
                                            isLocked = true;
                                        }
                                    }
                                }

                                const isActive = activeLesson?._id === lesson._id;
                                const isDone = completedLessons.has(lesson._id);

                                return (
                                    <div
                                        key={lesson._id}
                                        onClick={() => !isLocked && setActiveLesson(lesson)}
                                        className={`px-6 py-3 flex items-start gap-3 cursor-pointer transition border-l-4 ${isActive
                                            ? "bg-white border-indigo-600 shadow-inner"
                                            : "border-transparent hover:bg-gray-100"
                                            } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <div className="mt-1 shrink-0">
                                            {isDone ? (
                                                <HiOutlineCheckCircle className="text-green-500" size={18} />
                                            ) : isLocked ? (
                                                <HiOutlineLockClosed className="text-gray-400" size={18} />
                                            ) : (
                                                <HiOutlinePlayCircle className={isActive ? "text-indigo-600" : "text-gray-400"} size={18} />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${isActive ? "text-indigo-900" : "text-gray-700"}`}>
                                                {lesson.title}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div
                                onClick={() => onAssignmentClick(module._id)}
                                className={`px-6 py-3 flex items-center gap-3 cursor-pointer transition border-l-4 group ${activeTab === "assignments" && activeModuleId === module._id ? "bg-indigo-50 border-indigo-600" : "border-transparent hover:bg-indigo-50"}`}
                            >
                                <div className="mt-1 shrink-0">
                                    <HiOutlineDocumentText className="text-gray-400 group-hover:text-indigo-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700 group-hover:text-indigo-900">
                                        Module Assignment
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
