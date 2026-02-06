import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { fetchLessonVideos, VideoRecommendation } from "../services/geminiVideo.service";


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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Course Builder
        </h1>
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

function ModuleBlock({ module }: any) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [recommendations, setRecommendations] = useState<VideoRecommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

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
      videoUrl,
    });
    setTitle("");
    setVideoUrl("");
    setRecommendations([]);
    loadLessons();
  };

  const handleGetSuggestions = async () => {
    if (!title) return;
    setLoadingRecs(true);
    try {
      const videos = await fetchLessonVideos(title);
      setRecommendations(videos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded mb-6 shadow-sm border border-gray-100">
      <h2 className="font-bold mb-3 text-lg text-indigo-900">{module.title}</h2>

      {lessons.map((l) => (
        <div key={l._id} className="ml-4 mb-2 flex items-center text-gray-700">
          <span className="mr-2 text-teal-500">•</span> {l.title}
        </div>
      ))}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Add New Lesson</h4>

        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 border p-2 rounded focus:outline-none focus:border-indigo-500"
            placeholder="Lesson title (e.g. Intro to React)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={handleGetSuggestions}
            disabled={!title || loadingRecs}
            className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded hover:bg-indigo-200 transition text-sm font-medium flex items-center gap-1"
          >
            {loadingRecs ? "Searching..." : "✨ AI Suggest"}
          </button>
        </div>

        {recommendations.length > 0 && (
          <div className="mb-3 p-3 bg-white border border-indigo-100 rounded shadow-sm max-h-40 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-2">Select a video to auto-fill:</p>
            {recommendations.map((vid, idx) => (
              <div
                key={idx}
                onClick={() => setVideoUrl(vid.url)}
                className="text-sm p-2 hover:bg-indigo-50 cursor-pointer rounded truncate flex justify-between group"
              >
                <span>{vid.title}</span>
                <span className="text-indigo-500 opacity-0 group-hover:opacity-100 text-xs">Use</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            className="flex-[2] border p-2 rounded focus:outline-none focus:border-indigo-500"
            placeholder="Video URL (YouTube)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button
            onClick={createLesson}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded shadow-sm transition"
          >
            Add Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
