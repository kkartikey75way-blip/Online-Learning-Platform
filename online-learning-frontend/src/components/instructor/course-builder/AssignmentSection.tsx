import React from "react";
import { HiOutlineDocumentText, HiOutlinePlusCircle, HiOutlineUserGroup } from "react-icons/hi2";
import { Assignment } from "../../../types/course-builder";

interface AssignmentSectionProps {
    assignment: Assignment | null;
    showAssignForm: boolean;
    setShowAssignForm: (val: boolean) => void;
    assignTitle: string;
    setAssignTitle: (val: string) => void;
    assignDesc: string;
    setAssignDesc: (val: string) => void;
    savingAssign: boolean;
    onSaveAssignment: () => void;
    onLoadSubmissions: () => void;
    loadingSubs: boolean;
    showSubmissions: boolean;
}

export const AssignmentSection: React.FC<AssignmentSectionProps> = ({
    assignment,
    showAssignForm,
    setShowAssignForm,
    assignTitle,
    setAssignTitle,
    assignDesc,
    setAssignDesc,
    savingAssign,
    onSaveAssignment,
    onLoadSubmissions,
    loadingSubs,
    showSubmissions,
}) => {
    return (
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
                                onClick={onLoadSubmissions}
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
                            onClick={onSaveAssignment}
                            disabled={savingAssign}
                            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {savingAssign ? "Saving..." : "Save Assignment"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
