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

  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const loadCourse = async () => {
      try {
        const courseRes = await api.get(`/courses/${courseId}`);
        setCourseTitle(courseRes.data.title);

        /* 1️⃣ PROGRESS */
        const progressRes = await api.get(
          `/progress/course/${courseId}`
        );

        setProgress(progressRes.data.progressPercent);
        setCompleted(
          new Set(progressRes.data.completedLessons)
        );

        const unlockedLessons: string[] =
          progressRes.data.unlockedLessons;

        /* 2️⃣ MODULES */
        const modulesRes = await api.get(
          `/modules/course/${courseId}`
        );

        const modulesWithLessons: Module[] =
          await Promise.all(
            modulesRes.data.map(async (mod: Module) => {
              const lessonsRes = await api.get(
                `/lessons/module/${mod._id}`
              );

              const lessons: Lesson[] =
                lessonsRes.data.map(
                  (lesson: Lesson) => ({
                    ...lesson,
                    isLocked:
                      !unlockedLessons.includes(
                        lesson._id
                      ),
                  })
                );

              return {
                ...mod,
                lessons,
              };
            })
          );

        setModules(modulesWithLessons);

        // Auto-expand all modules initially
        setExpandedModules(new Set(modulesWithLessons.map(m => m._id)));

        // Select first meaningful lesson if none selected
        if (!activeLesson && modulesWithLessons.length > 0) {
          for (const mod of modulesWithLessons) {
            if (mod.lessons.length > 0) {
              const first = mod.lessons[0];
              if (!first.isLocked) {
                setActiveLesson(first);
                break;
              }
            }
          }
        }

      } catch (error) {
        console.error("Course load failed", error);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleComplete = async (lessonId: string) => {
    if (!courseId || completed.has(lessonId)) return;

    const res = await markLessonComplete(
      courseId,
      lessonId
    );

    setProgress(res.progressPercent);
    setCompleted(
      (prev) => new Set(prev).add(lessonId)
    );
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
      {/* NAVBAR AREA (Assuming MainLayout handles top nav, this is sub-nav) */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm z-10">
        <h1 className="text-xl font-bold text-indigo-900 truncate">
          {courseTitle || "Loading Course..."}
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-500">
            {Math.round(progress)}% Complete
          </div>
          <div className="w-32 bg-gray-200 h-2 rounded-full">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* MAIN PLAYER AREA */}
        <div className="flex-1 bg-gray-900 overflow-y-auto relative flex flex-col items-center justify-center">
          {activeLesson ? (
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
                    <video
                      src={activeLesson.videoUrl}
                      controls
                      className="max-h-full max-w-full"
                      autoPlay
                    />
                  )
                ) : (
                  <div className="text-gray-500 flex flex-col items-center">
                    <HiOutlinePlayCircle size={64} />
                    <p className="mt-4 text-lg">No video available</p>
                  </div>
                )}
              </div>
              <div className="bg-white p-6 border-t flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeLesson.title}</h2>
                  <p className="text-gray-600">{activeLesson.content || "Watch the video to learn more."}</p>
                </div>
                <button
                  onClick={() => handleComplete(activeLesson._id)}
                  disabled={completed.has(activeLesson._id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${completed.has(activeLesson._id)
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                    }`}
                >
                  {completed.has(activeLesson._id) ? (
                    <>
                      <HiOutlineCheckCircle size={20} /> Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <p>Select a lesson to start learning</p>
            </div>
          )}
        </div>

        {/* SIDEBAR CURRICULUM */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <div className="p-6 border-b bg-gray-50/50 backdrop-blur">
            <h3 className="font-bold text-lg text-indigo-900">Course Content</h3>
            <p className="text-sm text-gray-500">{modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons</p>
          </div>

          <div className="">
            {modules.map(module => (
              <div key={module._id} className="border-b last:border-none">
                <button
                  onClick={() => toggleModule(module._id)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-800 text-left">{module.title}</span>
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
                              ? "bg-indigo-50 border-indigo-600"
                              : "border-transparent hover:bg-gray-100"
                            } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="mt-1">
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
                            <p className="text-xs text-gray-400">10 min</p> {/* Placeholder duration */}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
