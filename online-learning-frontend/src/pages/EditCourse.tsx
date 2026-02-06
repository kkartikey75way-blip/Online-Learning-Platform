import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../services/api";
import { updateCourse, getCourseById } from "../services/course.service";

export default function EditCourse() {
    const navigate = useNavigate();
    const { courseId } = useParams();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        price: 0,
        capacity: 50,
        dripEnabled: false,
    });

    useEffect(() => {
        if (courseId) {
            getCourseById(courseId).then((data) => {
                setForm({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    price: data.price,
                    capacity: data.capacity,
                    dripEnabled: data.dripEnabled,
                });
            });
        }
    }, [courseId]);

    const handleUpdate = async (andEditCurriculum = false) => {
        try {
            if (!courseId) return;
            await updateCourse(courseId, form);

            await Swal.fire({
                icon: "success",
                title: "Course updated 🎉",
                text: "Changes saved successfully",
                confirmButtonColor: "#14b8a6",
                timer: 1500,
                showConfirmButton: false
            });

            if (andEditCurriculum) {
                navigate(`/instructor/course/${courseId}/builder`);
            } else {
                navigate("/instructor");
            }
        } catch (error: any) {
            Swal.fire(
                "Failed",
                error?.response?.data?.message ||
                "Course update failed",
                "error"
            );
        }
    };

    return (
        <section className="min-h-screen bg-[#f9f7f2]">
            <div className="max-w-3xl mx-auto px-8 py-14">

                <h1 className="text-3xl font-bold text-indigo-900 mb-6">
                    Edit Course
                </h1>

                <div className="bg-white rounded-xl shadow p-8 space-y-4">

                    <input
                        placeholder="Course title"
                        className="w-full p-3 border rounded"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                    />

                    <textarea
                        placeholder="Course description"
                        className="w-full p-3 border rounded"
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />

                    <input
                        placeholder="Category (e.g. Web Development)"
                        className="w-full p-3 border rounded"
                        value={form.category}
                        onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                        }
                    />

                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Price"
                            className="w-full p-3 border rounded"
                            value={form.price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price: Number(e.target.value),
                                })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Capacity"
                            className="w-full p-3 border rounded"
                            value={form.capacity}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    capacity: Number(e.target.value),
                                })
                            }
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.dripEnabled}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    dripEnabled: e.target.checked,
                                })
                            }
                        />
                        Enable drip content
                    </label>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={() => handleUpdate(false)}
                            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg cursor-pointer transition"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => handleUpdate(true)}
                            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg cursor-pointer transition"
                        >
                            Save & Edit Lessons
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
