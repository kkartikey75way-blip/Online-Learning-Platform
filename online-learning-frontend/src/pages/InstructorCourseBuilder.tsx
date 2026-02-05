import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CourseBuilder() {
  const { courseId } = useParams();
  const [modules, setModules] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const loadModules = async () => {
    const res = await api.get(`/modules/course/${courseId}`);
    setModules(res.data);
  };

  useEffect(() => {
    loadModules();
  }, []);

  const createModule = async () => {
    await api.post("/modules", {
      title,
      courseId,
    });
    setTitle("");
    loadModules();
  };

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Course Builder
      </h1>

      <div className="flex gap-3 mb-6">
        <input
          className="p-2 border rounded"
          placeholder="Module title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={createModule}
          className="bg-teal-500 text-white px-4 rounded"
        >
          Add Module
        </button>
      </div>

      {modules.map((mod) => (
        <ModuleBlock key={mod._id} module={mod} />
      ))}
    </div>
  );
}

function ModuleBlock({ module }: any) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const loadLessons = async () => {
    const res = await api.get(
      `/lessons/module/${module._id}`
    );
    setLessons(res.data);
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const createLesson = async () => {
    await api.post("/lessons", {
      title,
      moduleId: module._id,
      content: "Lesson content",
    });
    setTitle("");
    loadLessons();
  };

  return (
    <div className="bg-white p-6 rounded mb-6">
      <h2 className="font-bold mb-3">{module.title}</h2>

      {lessons.map((l) => (
        <p key={l._id} className="ml-4">
          • {l.title}
        </p>
      ))}

      <div className="flex gap-2 mt-3">
        <input
          className="border p-2 rounded"
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={createLesson}
          className="bg-indigo-500 text-white px-3 rounded"
        >
          Add Lesson
        </button>
      </div>
    </div>
  );
}
