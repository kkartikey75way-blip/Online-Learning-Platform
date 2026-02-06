import { useState, useEffect } from "react";
import { api } from "../services/api";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";
import Swal from "sweetalert2";

const CATEGORIES = [
    "Development", "Business", "Design", "Marketing", "Health", "Music", "Photography", "Personal Development"
];

export default function InterestSelector({ initialInterests, onUpdate, onClose }: {
    initialInterests: string[],
    onUpdate: (newInterests: string[]) => void,
    onClose: () => void
}) {
    const [selected, setSelected] = useState<string[]>(initialInterests);
    const [saving, setSaving] = useState(false);

    const toggleInterest = (cat: string) => {
        if (selected.includes(cat)) {
            setSelected(selected.filter(i => i !== cat));
        } else {
            setSelected([...selected, cat]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch("/auth/interests", { interests: selected });
            onUpdate(selected);
            Swal.fire({
                title: "Interests Updated!",
                text: "Your recommendations will now be personalized.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            onClose();
        } catch (e) {
            Swal.fire("Error", "Failed to update interests", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8 sm:p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-indigo-900 mb-2">My Interests</h2>
                            <p className="text-gray-500 font-medium">Select categories you'd like to learn about.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <HiOutlineXMark size={24} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-10">
                        {CATEGORIES.map(cat => {
                            const isActive = selected.includes(cat);
                            return (
                                <button
                                    key={cat}
                                    onClick={() => toggleInterest(cat)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-bold text-sm ${isActive
                                            ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm shadow-teal-100"
                                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                        }`}
                                >
                                    {cat}
                                    {isActive && <HiOutlineCheck className="text-teal-600" size={18} />}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-100"
                    >
                        {saving ? "Saving Changes..." : "Update Recommendations"}
                    </button>
                </div>
            </div>
        </div>
    );
}
