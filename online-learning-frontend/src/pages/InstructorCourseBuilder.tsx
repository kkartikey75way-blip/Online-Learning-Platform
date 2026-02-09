import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ModuleBlock } from "../components/instructor/course-builder/ModuleBlock";
import { Module } from "../types/course-builder";

export default function CourseBuilder() {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [title, setTitle] = useState("");

  const loadModules = async () => {
    const res = await api.get(`/modules/course/${courseId}`);
    setModules(res.data);
  };

  useEffect(() => {
    loadModules();
  }, [courseId]);

  const createModule = async () => {
    if (!title) return;
    await api.post("/modules", {
      title,
      courseId,
    });
    setTitle("");
    loadModules();
  };

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Course Builder</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-black transition"
        >
          Done / Go Back
        </button>
      </div>

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
