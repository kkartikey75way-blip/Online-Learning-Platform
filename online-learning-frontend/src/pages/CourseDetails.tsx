import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { markLessonComplete } from "../services/progress.service";
import ChatModule from "../components/ChatModule";
import AssignmentPage from "./AssignmentPage";
import DiscussionSection from "../components/DiscussionSection";

import { CourseHeader } from "../components/course/CourseHeader";
import { VideoPlayer } from "../components/course/VideoPlayer";
import { EnrollmentLock } from "../components/course/EnrollmentLock";
import { LessonControls } from "../components/course/LessonControls";
import { CurriculumSidebar } from "../components/course/CurriculumSidebar";
import { NotesSection } from "../components/course/NotesSection";

import type { Module, Lesson, Course } from "../types/course.types";
import Swal from "sweetalert2"

export default function CourseDetails() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"curriculum" | "info" | "discussion" | "notes" | "messages" | "assignments">("curriculum");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<Course | null>(null);

  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);

  // Helper functions for cleaner JSX
  const getTabClassName = (tab: string, isDisabled: boolean): string => {
    if (isDisabled) {
      return "flex-1 py-3 font-semibold text-sm capitalize transition opacity-40 cursor-not-allowed bg-gray-100 text-gray-400";
    }

    const baseClasses = "flex-1 py-3 font-semibold text-sm capitalize transition";
    const activeClasses = activeTab === tab
      ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50"
      : "text-gray-500 hover:bg-gray-50";

    return `${baseClasses} ${activeClasses}`;
  };

  const getTabLabel = (tab: string): string => {
    if (tab === "discussion") return "Forums";
    if (tab === "messages") return "Contact";
    return tab;
  };

  const loadCourseData = async () => {
    if (!courseId) return;
    try {
      const courseRes = await api.get(`/courses/${courseId}`);
      let currentInstructor = false;
      if (courseRes.data) {
        setCourseData(courseRes.data);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        currentInstructor = courseRes.data.instructor?._id === user._id;
        setIsInstructor(currentInstructor);
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
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'response' in e) {
          const axiosError = e as { response?: { status?: number } };
          if (axiosError.response?.status !== 403) {
            console.error("Progress fetch failed", e);
          }
        }
        setIsEnrolled(false);
        if (!currentInstructor) {
          setActiveTab("info");
        }
      }
      setLoadingEnrollment(false);
      setCompleted(completedSet);

      const modulesRes = await api.get(`/modules/course/${courseId}`);
      const modulesWithLessons: Module[] = await Promise.all(
        modulesRes.data.map(async (mod: Module) => {
          try {
            const lessonsRes = await api.get(`/lessons/module/${mod._id}`);
            const lessons: Lesson[] = lessonsRes.data.map((lesson: Lesson) => ({
              ...lesson,
              isLocked: !currentInstructor && (!currentEnrolled || (unlocked.length > 0 ? !unlocked.includes(lesson._id) : false)),
            }));
            return { ...mod, lessons };
          } catch (error: unknown) {
            return { ...mod, lessons: [] };
          }
        })
      );

      setModules(modulesWithLessons);
      setExpandedModules(new Set(modulesWithLessons.map(m => m._id)));

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

      await Swal.fire({
        icon: "success",
        title: "Enrollment Successful 🎉",
        text: "You now have full access to this course.",
        confirmButtonColor: "#14b8a6", // teal-500
      });

      await loadCourseData();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Enrollment Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleClaimCertificate = async () => {
    try {
      await api.post("/certificates/issue", { courseId });

      await Swal.fire({
        icon: "success",
        title: "Certificate Issued 🎓",
        text: "Your certificate has been successfully issued. You can download it from your profile.",
        confirmButtonColor: "#14b8a6",
      });
    } catch (e: any) {
      await Swal.fire({
        icon: "error",
        title: "Certificate Not Issued",
        text:
          e?.response?.data?.message ||
          "Please complete the course 100% before claiming your certificate.",
        confirmButtonColor: "#ef4444",
      });
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

  const findRelativeLesson = (offset: number): Lesson | null => {
    if (!activeLesson || modules.length === 0) return null;

    const allLessons = modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l._id === activeLesson._id);

    if (currentIndex === -1) return null;
    return allLessons[currentIndex + offset] || null;
  };

  const nextLesson = findRelativeLesson(1);
  const prevLesson = findRelativeLesson(-1);

  const tabs = ["curriculum", "info", "discussion", "notes", "messages"] as const;

  return (
    <div className="flex flex-col h-screen bg-[#f9f7f2]">
      <CourseHeader title={courseData?.title || "Loading Course..."} progress={progress} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isEnrolled && !isInstructor && !loadingEnrollment && <EnrollmentLock onEnroll={handleEnroll} />}

          {(isEnrolled || isInstructor) && (
            <>
              <VideoPlayer lesson={activeLesson} />

              {activeLesson && (
                <LessonControls
                  activeLesson={activeLesson}
                  onPrev={() => prevLesson && setActiveLesson(prevLesson)}
                  onNext={() => nextLesson && setActiveLesson(nextLesson)}
                  hasPrev={!!prevLesson}
                  hasNext={!!nextLesson}
                  progress={progress}
                  isCompleted={completed.has(activeLesson._id)}
                  onComplete={() => handleComplete(activeLesson._id)}
                  onClaimCertificate={handleClaimCertificate}
                />
              )}
            </>
          )}
        </div>

        <div className="w-96 bg-white border-l flex flex-col shrink-0 z-20 shadow-lg">
          <div className="flex border-b">
            {tabs.map(tab => {
              const isDisabled = !isInstructor && !isEnrolled && tab !== "info" && tab !== "discussion";

              return (
                <button
                  key={tab}
                  onClick={() => !isDisabled && setActiveTab(tab)}
                  disabled={isDisabled}
                  className={getTabClassName(tab, isDisabled)}
                  title={isDisabled ? "Enroll to access" : ""}
                >
                  {getTabLabel(tab)}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "curriculum" && courseData && (
              <CurriculumSidebar
                modules={modules}
                expandedModules={expandedModules}
                toggleModule={toggleModule}
                activeLesson={activeLesson}
                setActiveLesson={setActiveLesson}
                completedLessons={completed}
                courseData={courseData}
                onAssignmentClick={(modId) => {
                  setActiveModuleId(modId);
                  setActiveTab("assignments");
                }}
                activeTab={activeTab}
                activeModuleId={activeModuleId}
                isInstructor={isInstructor}
              />
            )}

            {activeTab === "info" && (
              <div className="p-6">
                {courseData ? (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{courseData.title}</h2>
                    <div
                      onClick={() => navigate(`/courses?instructor=${courseData.instructor?._id}`)}
                      className="flex items-center gap-2 mb-4 cursor-pointer hover:text-indigo-600 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs group-hover:bg-indigo-200 transition-colors">
                        {courseData.instructor?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                        {courseData.instructor?.name}
                      </span>
                    </div>
                    <div className="prose prose-sm text-gray-600">
                      <h3 className="text-gray-800 font-semibold mb-1">About this course</h3>
                      <p>{courseData.description || "No description provided."}</p>
                      <h3 className="text-gray-800 font-semibold mt-4 mb-1">Category</h3>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">{courseData.category || "General"}</span>
                    </div>
                  </>
                ) : <p>Loading info...</p>}
              </div>
            )}

            {activeTab === "discussion" && <DiscussionSection courseId={courseId!} />}
            {activeTab === "notes" && <NotesSection lessonId={activeLesson?._id} />}
            {activeTab === "assignments" && <AssignmentPage moduleId={activeModuleId!} />}
            {activeTab === "messages" && courseData?.instructor && (
              <ChatModule
                courseId={courseId!}
                otherUserId={courseData.instructor._id}
                otherUserName={courseData.instructor.name}
                currentUserId={JSON.parse(localStorage.getItem("user") || "{}")._id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
