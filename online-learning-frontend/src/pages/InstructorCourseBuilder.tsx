import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { fetchLessonVideos, VideoRecommendation } from "../services/geminiVideo.service";
import { createAssignment, getModuleAssignment, getAssignmentSubmissions, gradeSubmission } from "../services/assignment.service";
import { HiOutlineDocumentText, HiOutlinePlusCircle, HiOutlineUserGroup, HiOutlineLink, HiOutlineCheckCircle, HiOutlineXMark } from "react-icons/hi2";


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

  const [assignment, setAssignment] = useState<any>(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [savingAssign, setSavingAssign] = useState(false);

  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<number | "">("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [savingGrade, setSavingGrade] = useState(false);

  const loadLessons = async () => {
    const res = await api.get(
      `/lessons/module/${module._id}`
    );
    setLessons(res.data);
  };

  useEffect(() => {
    loadLessons();
    getModuleAssignment(module._id).then(data => {
      if (data) {
        setAssignment(data);
        setAssignTitle(data.title);
        setAssignDesc(data.description);
      }
    });
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

  const saveAssignment = async () => {
    if (!assignTitle || !assignDesc) return;
    setSavingAssign(true);
    try {
      const res = await createAssignment({
        moduleId: module._id,
        courseId: module.course,
        title: assignTitle,
        description: assignDesc
      });
      setAssignment(res);
      setShowAssignForm(false);
    } catch (err) {
      alert("Failed to save assignment");
    } finally {
      setSavingAssign(false);
    }
  };

  const loadSubmissions = async () => {
    if (!assignment) return;
    setLoadingSubs(true);
    try {
      const data = await getAssignmentSubmissions(assignment._id);
      setSubmissions(data);
      setShowSubmissions(true);
    } catch (err) {
      alert("Failed to load submissions");
    } finally {
      setLoadingSubs(false);
    }
  };

  const handleGrade = async (sub: any) => {
    setGradingId(sub._id);
    setGradeInput(sub.grade || "");
    setFeedbackInput(sub.feedback || "");
  };

  const submitGrade = async (submissionId: string) => {
    if (gradeInput === "") return;
    setSavingGrade(true);
    try {
      await gradeSubmission(submissionId, { grade: Number(gradeInput), feedback: feedbackInput });
      setSubmissions(prev => prev.map(s => s._id === submissionId ? { ...s, grade: gradeInput, feedback: feedbackInput } : s));
      setGradingId(null);
    } catch (err) {
      alert("Failed to save grade");
    } finally {
      setSavingGrade(false);
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

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <HiOutlineDocumentText className="text-indigo-600" size={20} />
            <h4 className="font-bold text-gray-800">Module Assignment</h4>
          </div>
          <div className="flex gap-3">
            {!assignment && !showAssignForm && (
              <button
                onClick={() => setShowAssignForm(true)}
                className="text-indigo-600 flex items-center gap-1 text-sm font-semibold hover:text-indigo-800"
              >
                <HiOutlinePlusCircle size={18} /> Add Assignment
              </button>
            )}
            {assignment && !showAssignForm && (
              <>
                <button
                  onClick={loadSubmissions}
                  className="text-teal-600 flex items-center gap-1 text-sm font-semibold hover:text-teal-800"
                >
                  <HiOutlineUserGroup size={18} /> {loadingSubs ? "Loading..." : "View Submissions"}
                </button>
                <button
                  onClick={() => setShowAssignForm(true)}
                  className="text-indigo-600 text-sm font-semibold hover:text-indigo-800"
                >
                  Edit Assignment
                </button>
              </>
            )}
          </div>
        </div>

        {assignment && !showAssignForm && !showSubmissions && (
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h5 className="font-bold text-indigo-900 mb-1">{assignment.title}</h5>
            <p className="text-sm text-indigo-700 opacity-80">{assignment.description}</p>
          </div>
        )}

        {showAssignForm && (
          <div className="bg-white border rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Assignment Title"
              value={assignTitle}
              onChange={(e) => setAssignTitle(e.target.value)}
            />
            <textarea
              className="w-full border p-2 rounded mb-3 h-24 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Instructions for students..."
              value={assignDesc}
              onChange={(e) => setAssignDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssignForm(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveAssignment}
                disabled={savingAssign}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {savingAssign ? "Saving..." : "Save Assignment"}
              </button>
            </div>
          </div>
        )}

        {showSubmissions && (
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h5 className="font-bold text-gray-800">Submissions ({submissions.length})</h5>
              <button onClick={() => setShowSubmissions(false)} className="text-gray-400 hover:text-gray-600">
                <HiOutlineXMark size={20} />
              </button>
            </div>
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm italic">
                  No submissions yet.
                </div>
              ) : submissions.map((sub) => (
                <div key={sub._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-gray-900">{sub.student.name}</p>
                      <p className="text-xs text-gray-400">{sub.student.email}</p>
                    </div>
                    <div className="text-right">
                      {sub.grade !== undefined ? (
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          <HiOutlineCheckCircle size={14} /> Graded: {sub.grade}%
                        </div>
                      ) : (
                        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                          Pending Grade
                        </div>
                      )}
                    </div>
                  </div>

                  <a
                    href={sub.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:underline mb-4"
                  >
                    <HiOutlineLink size={16} /> View Submission Link
                  </a>

                  {gradingId === sub._id ? (
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-24">
                          <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-1 mb-1 block">Grade (%)</label>
                          <input
                            type="number"
                            className="w-full border p-2 rounded-lg font-bold text-center focus:ring-2 focus:ring-indigo-500"
                            placeholder="0-100"
                            value={gradeInput}
                            onChange={(e) => setGradeInput(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-1 mb-1 block">Feedback</label>
                          <textarea
                            className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                            placeholder="Add comments..."
                            rows={1}
                            value={feedbackInput}
                            onChange={(e) => setFeedbackInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setGradingId(null)}
                          className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-200 rounded-lg transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => submitGrade(sub._id)}
                          disabled={savingGrade || gradeInput === ""}
                          className="px-4 py-1.5 text-xs bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                          {savingGrade ? "Saving..." : "Save Grade"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        {sub.feedback && (
                          <p className="text-sm text-gray-600 italic">"{sub.feedback}"</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleGrade(sub)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-900 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                      >
                        {sub.grade !== undefined ? "Edit Grade" : "Grade Now"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
