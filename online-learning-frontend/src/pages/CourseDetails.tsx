import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { markLessonComplete } from "../services/progress.service";
import {
  HiOutlineCheckCircle,
  HiOutlinePlayCircle,
  HiOutlineChartBar,
  HiOutlineLockClosed,
} from "react-icons/hi2";

import type { Module, Lesson } from "../types/course.types";

export default function CourseDetails() {
  const { id: courseId } = useParams<{ id: string }>();

  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!courseId) return;

    const loadCourse = async () => {
      try {
        /* 1️⃣ Load progress */
        const progressRes = await api.get(
          `/progress/course/${courseId}`
        );

        setProgress(progressRes.data.progressPercent);
        setCompleted(
          new Set(progressRes.data.completedLessons)
        );

        const unlockedLessons: string[] =
          progressRes.data.unlockedLessons;

        /* 2️⃣ Load modules + lessons */
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
      } catch (error) {
        console.error(
          "Failed to load course content",
          error
        );
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

  return (
    <section className="min-h-screen bg-[#f9f7f2]">
      <div className="max-w-5xl mx-auto px-8 py-14">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">
            Course Content
          </h1>
          <p className="text-gray-600">
            Complete lessons to track your progress
          </p>
        </div>

        {/* PROGRESS */}
        <div className="bg-white rounded-2xl p-6 shadow mb-10">
          <div className="flex items-center gap-3 mb-3">
            <HiOutlineChartBar className="text-teal-500 text-xl" />
            <span className="font-medium text-indigo-900">
              Progress
            </span>
          </div>

          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-teal-500 h-3 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {progress}% completed
          </p>
        </div>

        {/* MODULES */}
        {modules.map((mod) => (
          <div key={mod._id} className="mb-10">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              {mod.title}
            </h2>

            <div className="space-y-3">
              {mod.lessons.map((lesson) => {
                const isDone = completed.has(
                  lesson._id
                );
                const isLocked =
                  lesson.isLocked && !isDone;

                return (
                  <div
                    key={lesson._id}
                    className={`flex items-center justify-between bg-white rounded-xl p-4 shadow-sm ${
                      isLocked && "opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <HiOutlineCheckCircle className="text-green-500 text-xl" />
                      ) : isLocked ? (
                        <HiOutlineLockClosed className="text-gray-400 text-xl" />
                      ) : (
                        <HiOutlinePlayCircle className="text-indigo-400 text-xl" />
                      )}

                      <span className="font-medium text-indigo-900">
                        {lesson.title}
                      </span>
                    </div>

                    <button
                      disabled={isDone || isLocked}
                      onClick={() =>
                        handleComplete(lesson._id)
                      }
                      className={`text-sm px-4 py-2 rounded-lg transition cursor-pointer ${
                        isDone
                          ? "bg-green-100 text-green-600 cursor-not-allowed"
                          : isLocked
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-teal-500 hover:bg-teal-600 text-white"
                      }`}
                    >
                      {isDone
                        ? "Completed"
                        : isLocked
                        ? "Locked"
                        : "Mark Complete"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
