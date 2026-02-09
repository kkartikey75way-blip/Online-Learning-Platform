import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

interface NotesSectionProps {
    lessonId?: string;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ lessonId }) => {
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
};
