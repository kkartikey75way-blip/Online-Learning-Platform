import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { markLessonComplete } from "../services/progress.service";
import {
  HiOutlineCheckCircle,
  HiOutlinePlayCircle,
  HiOutlineChartBar,
} from "react-icons/hi2";

interface Lesson {
  _id: string;
  title: string;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

export default function CourseDetails() {
  const { id: courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadContent = async () => {
      const modulesRes = await api.get(
        `/modules/course/${courseId}`
      );

      const modulesWithLessons = await Promise.all(
        modulesRes.data.map(async (mod: any) => {
          const lessonsRes = await api.get(
            `/lessons/module/${mod._id}`
          );
          return {
            ...mod,
            lessons: lessonsRes.data,
          };
        })
      );

      setModules(modulesWithLessons);
    };

    loadContent();
  }, [courseId]);

  const handleComplete = async (lessonId: string) => {
    if (completed.has(lessonId)) return;

    const res = await markLessonComplete(
      courseId!,
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

                return (
                  <div
                    key={lesson._id}
                    className={`flex items-center justify-between bg-white rounded-xl p-4 shadow-sm ${
                      isDone && "opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <HiOutlineCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <HiOutlinePlayCircle className="text-indigo-400 text-xl" />
                      )}
                      <span className="font-medium text-indigo-900">
                        {lesson.title}
                      </span>
                    </div>

                    <button
                      disabled={isDone}
                      onClick={() =>
                        handleComplete(lesson._id)
                      }
                      className={`text-sm px-4 py-2 rounded-lg transition ${
                        isDone
                          ? "bg-green-100 text-green-600 cursor-not-allowed"
                          : "bg-teal-500 hover:bg-teal-600 text-white"
                      }`}
                    >
                      {isDone
                        ? "Completed"
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
