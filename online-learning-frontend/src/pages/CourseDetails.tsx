import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { markLessonComplete } from "../services/progress.service";
import { io, Socket } from "socket.io-client";
import ChatModule from "../components/ChatModule";
import AssignmentPage from "./AssignmentPage";
import DiscussionSection from "../components/DiscussionSection";

import {
  HiOutlineCheckCircle,
  HiOutlinePlayCircle,
  HiOutlineLockClosed,
  HiChevronDown,
  HiChevronUp,
  HiArrowSmallLeft,
  HiArrowSmallRight,
  HiOutlineDocumentText,
} from "react-icons/hi2";

import type { Module, Lesson } from "../types/course.types";

export default function CourseDetails() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"curriculum" | "info" | "discussion" | "notes" | "messages" | "assignments">("curriculum");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<any>(null);

  // Restore missing state
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);

  const loadCourseData = async () => {
    if (!courseId) return;
    try {
      const courseRes = await api.get(`/courses/${courseId}`);
      if (courseRes.data) {
        setCourseData(courseRes.data);
      }


      let completedSet = new Set<string>();
      let unlocked: string[] = [];
      let currentEnrolled = false;

      try {
        const progressRes = await api.get(`/progress/course/${courseId}`);
        if (progressRes.data) {
          currentEnrolled = true;
          setIsEnrolled(true);
          setProgress(progressRes.data.progressPercent);
          completedSet = new Set(progressRes.data.completedLessons);
          unlocked = progressRes.data.unlockedLessons || [];
        }
      } catch (e: any) {
        if (e.response?.status === 403) {
          console.log("User not enrolled");
        } else {
          console.error("Progress fetch failed", e);
        }
        currentEnrolled = false;
        setIsEnrolled(false);
      }
      setLoadingEnrollment(false);
      setCompleted(completedSet);


      const modulesRes = await api.get(`/modules/course/${courseId}`);
      const modulesWithLessons: Module[] = await Promise.all(
        modulesRes.data.map(async (mod: Module) => {
          const lessonsRes = await api.get(`/lessons/module/${mod._id}`);
          const lessons: Lesson[] = lessonsRes.data.map((lesson: Lesson) => ({
            ...lesson,
            isLocked: !currentEnrolled || (unlocked.length > 0 ? !unlocked.includes(lesson._id) : false),
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

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      alert("Enrolled successfully!");
      // Re-fetch all course data to unlock lessons instantly
      await loadCourseData();
    } catch (e) {
      alert("Failed to enroll");
    }
  };

  const handleClaimCertificate = async () => {
    try {
      await api.post("/certificates/issue", { courseId });
      alert("Certificate Issued! Check your profile.");
    } catch (e) {
      alert("Failed to issue certificate. Ensure course is completed.");
    }
  };


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

  const findNextLesson = () => {
    if (!activeLesson || modules.length === 0) return null;

    let currentModIdx = -1;
    let currentLessIdx = -1;

    for (let i = 0; i < modules.length; i++) {
      const idx = modules[i].lessons.findIndex(l => l._id === activeLesson._id);
      if (idx !== -1) {
        currentModIdx = i;
        currentLessIdx = idx;
        break;
      }
    }

    if (currentModIdx === -1) return null;

    // Next lesson in same module
    if (currentLessIdx < modules[currentModIdx].lessons.length - 1) {
      return modules[currentModIdx].lessons[currentLessIdx + 1];
    }

    // First lesson of next module
    if (currentModIdx < modules.length - 1) {
      for (let i = currentModIdx + 1; i < modules.length; i++) {
        if (modules[i].lessons.length > 0) {
          return modules[i].lessons[0];
        }
      }
    }

    return null;
  };

  const findPrevLesson = () => {
    if (!activeLesson || modules.length === 0) return null;

    let currentModIdx = -1;
    let currentLessIdx = -1;

    for (let i = 0; i < modules.length; i++) {
      const idx = modules[i].lessons.findIndex(l => l._id === activeLesson._id);
      if (idx !== -1) {
        currentModIdx = i;
        currentLessIdx = idx;
        break;
      }
    }

    if (currentModIdx === -1) return null;

    // Prev lesson in same module
    if (currentLessIdx > 0) {
      return modules[currentModIdx].lessons[currentLessIdx - 1];
    }

    // Last lesson of prev module
    if (currentModIdx > 0) {
      for (let i = currentModIdx - 1; i >= 0; i--) {
        if (modules[i].lessons.length > 0) {
          return modules[i].lessons[modules[i].lessons.length - 1];
        }
      }
    }

    return null;
  };

  const nextLesson = findNextLesson();
  const prevLesson = findPrevLesson();

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
          {!isEnrolled ? (
            // NOT ENROLLED COVER
            <div className="flex flex-col items-center justify-center text-center p-8 text-white max-w-lg">
              <div className="bg-teal-500 p-6 rounded-full bg-opacity-20 mb-6">
                <HiOutlineLockClosed className="text-teal-400 w-16 h-16" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Course Content Locked</h2>
              <p className="text-gray-400 mb-8">
                Enroll in this course to access videos, modules, and track your progress toward a certificate.
              </p>
              <button
                onClick={handleEnroll}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Enroll Now <HiOutlineCheckCircle />
              </button>
            </div>
          ) : activeLesson ? (
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
                <div className="flex gap-2">
                  <button
                    onClick={() => prevLesson && setActiveLesson(prevLesson)}
                    disabled={!prevLesson}
                    className={`p-3 rounded-lg border transition ${!prevLesson ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 active:scale-95"}`}
                    title="Previous Lesson"
                  >
                    <HiArrowSmallLeft size={20} />
                  </button>
                  <button
                    onClick={() => nextLesson && setActiveLesson(nextLesson)}
                    disabled={!nextLesson}
                    className={`p-3 rounded-lg border transition ${!nextLesson ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 active:scale-95"}`}
                    title="Next Lesson"
                  >
                    <HiArrowSmallRight size={20} />
                  </button>
                </div>

                {Math.round(progress) === 100 && (
                  <button
                    onClick={handleClaimCertificate}
                    className="px-6 py-3 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 shadow-md transition flex items-center gap-2"
                  >
                    🏆 Claim Certificate
                  </button>
                )}
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
            <button
              onClick={() => setActiveTab("discussion")}
              className={`flex-1 py-3 font-semibold text-sm ${activeTab === "discussion" ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Forums
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-3 font-semibold text-sm ${activeTab === "notes" ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex-1 py-3 font-semibold text-sm ${activeTab === "messages" ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Contact
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
                        {/* Assignment Row */}
                        <div
                          onClick={() => {
                            setActiveModuleId(module._id);
                            setActiveTab("assignments");
                          }}
                          className={`px-6 py-3 flex items-center gap-3 cursor-pointer transition border-l-4 group ${(activeTab as string) === "assignments" && activeModuleId === module._id ? "bg-indigo-50 border-indigo-600" : "border-transparent hover:bg-indigo-50"}`}
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
            ) : activeTab === "info" ? (
              <div className="p-6">
                {courseData ? (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{courseData.title}</h2>
                    <div
                      onClick={() => navigate(`/courses?instructor=${courseData.instructor?._id}`)}
                      className="flex items-center gap-2 mb-4 cursor-pointer hover:text-indigo-600 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs group-hover:bg-indigo-200 transition-colors">
                        {courseData.instructor?.name?.substring(0, 2) || "IN"}
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
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
            ) : activeTab === "discussion" ? (
              <div className="flex flex-col h-full bg-white overflow-hidden">
                <DiscussionSection courseId={courseId!} />
              </div>
            ) : activeTab === "notes" ? (
              <div className="flex flex-col h-full bg-white">
                <NotesSection lessonId={activeLesson?._id} />
              </div>
            ) : activeTab === "assignments" ? (
              <div className="flex flex-col h-full bg-white">
                <AssignmentPage moduleId={activeModuleId!} />
              </div>
            ) : (
              <div className="flex flex-col h-full bg-white">
                {courseData?.instructor && (
                  <ChatModule
                    courseId={courseId!}
                    otherUserId={courseData.instructor._id}
                    otherUserName={courseData.instructor.name}
                    currentUserId={JSON.parse(localStorage.getItem("user") || "{}")._id}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}



function NotesSection({ lessonId }: { lessonId?: string }) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/lesson/${lessonId}`);
        if (res.data) setNote(res.data.content);
        else setNote("");
      } catch (e) {
        setNote("");
      }
    };
    fetchNote();
  }, [lessonId]);

  const handleSave = async () => {
    if (!lessonId) return;
    setSaving(true);
    try {
      await api.post(`/notes/lesson/${lessonId}`, { content: note });
    } catch (e) {
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  if (!lessonId) return <div className="p-6 text-gray-500">Select a lesson to take notes.</div>;

  return (
    <div className="flex flex-col h-full p-6">
      <h3 className="font-bold text-gray-800 mb-4">Lesson Notes</h3>
      <p className="text-xs text-gray-500 mb-4">These notes are private to you.</p>
      <textarea
        className="flex-1 w-full border rounded-lg p-4 text-sm resize-none focus:ring-2 focus:ring-teal-500 focus:outline-none"
        placeholder="Type your notes here... (Automatically saves)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleSave}
      />
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[10px] text-gray-400">
          {saving ? "Saving..." : "Last saved at " + new Date().toLocaleTimeString()}
        </span>
        <button
          onClick={handleSave}
          className="text-xs font-bold text-teal-600 hover:text-teal-700"
        >
          Save Now
        </button>
      </div>
    </div>
  );
}
