import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { markLessonComplete } from "../services/progress.service";

import {
  HiOutlineCheckCircle,
  HiOutlinePlayCircle,
  HiOutlineLockClosed,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi2";

import type { Module, Lesson } from "../types/course.types";

export default function CourseDetails() {
  const { id: courseId } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<"curriculum" | "info">("curriculum");
  const [courseData, setCourseData] = useState<any>(null);

  // Restore missing state
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const loadCourse = async () => {
      try {
        const courseRes = await api.get(`/courses/${courseId}`);
        if (courseRes.data) {
          setCourseData(courseRes.data);
        }

        /* 1️⃣ PROGRESS (Soft Fail) */
        let completedSet = new Set<string>();
        let unlocked: string[] = [];
        try {
          const progressRes = await api.get(`/progress/course/${courseId}`);
          setProgress(progressRes.data.progressPercent);
          completedSet = new Set(progressRes.data.completedLessons);
          unlocked = progressRes.data.unlockedLessons;
        } catch (e) { console.warn("No progress data"); }

        setCompleted(completedSet);

        /* 2️⃣ MODULES */
        const modulesRes = await api.get(`/modules/course/${courseId}`);
        const modulesWithLessons: Module[] = await Promise.all(
          modulesRes.data.map(async (mod: Module) => {
            const lessonsRes = await api.get(`/lessons/module/${mod._id}`);
            const lessons: Lesson[] = lessonsRes.data.map((lesson: Lesson) => ({
              ...lesson,
              isLocked: unlocked.length > 0 ? !unlocked.includes(lesson._id) : false,
            }));
            return { ...mod, lessons };
          })
        );

        setModules(modulesWithLessons);
        setExpandedModules(new Set(modulesWithLessons.map(m => m._id)));

        // Select first lesson if needed
        if (!activeLesson && modulesWithLessons.length > 0) {
          for (const mod of modulesWithLessons) {
            if (mod.lessons.length > 0) {
              setActiveLesson(mod.lessons[0]);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Course load failed", error);
      }
    };

    loadCourse();
  }, [courseId]);

  // ... (handleComplete, toggleModule same as before) ...

  const handleComplete = async (lessonId: string) => {
    if (!courseId || completed.has(lessonId)) return;
    try {
      const res = await markLessonComplete(courseId, lessonId);
      setProgress(res.progressPercent);
      setCompleted((prev) => new Set(prev).add(lessonId));
    } catch (e) { }
  };

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9f7f2]">
      {/* NAVBAR */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
        <h1 className="text-xl font-bold text-indigo-900 truncate flex-1 mr-4">
          {courseData?.title || "Loading Course..."}
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

      <div className="flex flex-1 overflow-hidden">
        {/* PLAYER */}
        <div className="flex-1 bg-gray-900 overflow-y-auto relative flex flex-col items-center justify-center">
          {activeLesson ? (
            // ... (Existing Player Code) ...
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center bg-black">
                {activeLesson.videoUrl ? (
                  activeLesson.videoUrl.includes("youtube.com") || activeLesson.videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                      title={activeLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={activeLesson.videoUrl} controls className="max-h-full max-w-full" autoPlay />
                  )
                ) : (
                  <div className="text-gray-500 flex flex-col items-center">
                    <HiOutlinePlayCircle size={64} />
                    <p className="mt-4">No video available</p>
                  </div>
                )}
              </div>
              <div className="bg-white p-6 border-t flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeLesson.title}</h2>
                  <p className="text-gray-600 max-w-2xl">{activeLesson.content || "No description available for this lesson."}</p>
                </div>
                <button
                  onClick={() => handleComplete(activeLesson._id)}
                  disabled={completed.has(activeLesson._id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${completed.has(activeLesson._id)
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                    }`}
                >
                  {completed.has(activeLesson._id) ? (<>Completed <HiOutlineCheckCircle /></>) : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <HiOutlinePlayCircle size={64} />
              <p className="mt-4 text-lg">Select a lesson to start</p>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="w-96 bg-white border-l flex flex-col shrink-0 z-20 shadow-lg">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`flex-1 py-3 font-semibold text-sm ${activeTab === "curriculum" ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-3 font-semibold text-sm ${activeTab === "info" ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Info
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "curriculum" ? (
              <div>
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-bold text-gray-800">Course Content</h3>
                  <p className="text-xs text-gray-500">{modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons</p>
                </div>
                {modules.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">
                    <p>No modules found.</p>
                  </div>
                ) : modules.map(module => (
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
                        {module.lessons.map((lesson) => {
                          const isLocked = lesson.isLocked && !completed.has(lesson._id);
                          const isActive = activeLesson?._id === lesson._id;
                          const isDone = completed.has(lesson._id);

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
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                {courseData ? (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{courseData.title}</h2>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {courseData.instructor?.name?.substring(0, 2) || "IN"}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Instructor: {courseData.instructor?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="prose prose-sm text-gray-600">
                      <h3 className="text-gray-800 font-semibold mb-1">About this course</h3>
                      <p>{courseData.description || "No description provided."}</p>

                      <h3 className="text-gray-800 font-semibold mt-4 mb-1">Category</h3>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">{courseData.category || "General"}</span>
                    </div>
                  </>
                ) : (
                  <p>Loading info...</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
