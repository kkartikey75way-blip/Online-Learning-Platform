import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";
import { fetchLessonVideos, VideoRecommendation } from "../../../services/geminiVideo.service";
import { createAssignment, getModuleAssignment, getAssignmentSubmissions, gradeSubmission } from "../../../services/assignment.service";
import { Lesson, Assignment, Submission, Module } from "../../../types/course-builder";
import { LessonForm } from "./LessonForm";
import { AssignmentSection } from "./AssignmentSection";
import { SubmissionsList } from "./SubmissionsList";

interface ModuleBlockProps {
    module: Module;
}

export const ModuleBlock: React.FC<ModuleBlockProps> = ({ module }) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [recommendations, setRecommendations] = useState<VideoRecommendation[]>([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [assignTitle, setAssignTitle] = useState("");
    const [assignDesc, setAssignDesc] = useState("");
    const [savingAssign, setSavingAssign] = useState(false);

    const [showSubmissions, setShowSubmissions] = useState(false);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loadingSubs, setLoadingSubs] = useState(false);
    const [gradingId, setGradingId] = useState<string | null>(null);
    const [gradeInput, setGradeInput] = useState<number | "">("");
    const [feedbackInput, setFeedbackInput] = useState("");
    const [savingGrade, setSavingGrade] = useState(false);

    const loadLessons = async () => {
        const res = await api.get(`/lessons/module/${module._id}`);
        setLessons(res.data);
    };

    useEffect(() => {
        loadLessons();
        getModuleAssignment(module._id).then((data) => {
            if (data) {
                setAssignment(data);
                setAssignTitle(data.title);
                setAssignDesc(data.description);
            }
        });
    }, [module._id]);

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
                description: assignDesc,
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

    const handleGrade = (sub: Submission) => {
        setGradingId(sub._id);
        setGradeInput(sub.grade || "");
        setFeedbackInput(sub.feedback || "");
    };

    const submitGrade = async (submissionId: string) => {
        if (gradeInput === "") return;
        setSavingGrade(true);
        try {
            await gradeSubmission(submissionId, {
                grade: Number(gradeInput),
                feedback: feedbackInput,
            });
            setSubmissions((prev) =>
                prev.map((s) =>
                    s._id === submissionId
                        ? { ...s, grade: Number(gradeInput), feedback: feedbackInput }
                        : s
                )
            );
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
                    <span className="mr-2 text-teal-500">?</span> {l.title}
                </div>
            ))}

            <LessonForm
                title={title}
                setTitle={setTitle}
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                loadingRecs={loadingRecs}
                onGetSuggestions={handleGetSuggestions}
                recommendations={recommendations}
                onCreateLesson={createLesson}
            />

            <AssignmentSection
                assignment={assignment}
                showAssignForm={showAssignForm}
                setShowAssignForm={setShowAssignForm}
                assignTitle={assignTitle}
                setAssignTitle={setAssignTitle}
                assignDesc={assignDesc}
                setAssignDesc={setAssignDesc}
                savingAssign={savingAssign}
                onSaveAssignment={saveAssignment}
                onLoadSubmissions={loadSubmissions}
                loadingSubs={loadingSubs}
                showSubmissions={showSubmissions}
            />

            {showSubmissions && (
                <SubmissionsList
                    submissions={submissions}
                    onClose={() => setShowSubmissions(false)}
                    gradingId={gradingId}
                    onGradeClick={handleGrade}
                    gradeInput={gradeInput}
                    setGradeInput={setGradeInput}
                    feedbackInput={feedbackInput}
                    setFeedbackInput={setFeedbackInput}
                    onCancelGrading={() => setGradingId(null)}
                    onSubmitGrade={submitGrade}
                    savingGrade={savingGrade}
                />
            )}
        </div>
    );
};
