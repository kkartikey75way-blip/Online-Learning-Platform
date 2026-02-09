import React from "react";
import { HiOutlineCheckCircle, HiOutlineLink, HiOutlineXMark } from "react-icons/hi2";
import { Submission } from "../../../types/course-builder";

interface SubmissionsListProps {
    submissions: Submission[];
    onClose: () => void;
    gradingId: string | null;
    onGradeClick: (sub: Submission) => void;
    gradeInput: number | "";
    setGradeInput: (val: number | "") => void;
    feedbackInput: string;
    setFeedbackInput: (val: string) => void;
    onCancelGrading: () => void;
    onSubmitGrade: (subId: string) => void;
    savingGrade: boolean;
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({
    submissions,
    onClose,
    gradingId,
    onGradeClick,
    gradeInput,
    setGradeInput,
    feedbackInput,
    setFeedbackInput,
    onCancelGrading,
    onSubmitGrade,
    savingGrade,
}) => {
    return (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h5 className="font-bold text-gray-800">Submissions ({submissions.length})</h5>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
                                <p className="font-bold text-gray-900">{sub.student.name || "Student"}</p>
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
                                        onClick={onCancelGrading}
                                        className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-200 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => onSubmitGrade(sub._id)}
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
                                    onClick={() => onGradeClick(sub)}
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
    );
};
