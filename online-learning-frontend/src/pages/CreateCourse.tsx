import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../services/api";

export default function CreateCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    capacity: 50,
    dripEnabled: false,
  });

  const handleCreate = async () => {
    try {
      await api.post("/courses", form);

      await Swal.fire({
        icon: "success",
        title: "Course created",
        text: "You can now add modules and lessons",
        confirmButtonColor: "#14b8a6",
      });

      navigate("/instructor");
    } catch (error: any) {
      Swal.fire(
        "Failed",
        error?.response?.data?.message || "Course creation failed",
        "error"
      );
    }
  };

  return (
    <section className="min-h-screen bg-[#f9f7f2]">
      <div className="max-w-3xl mx-auto px-8 py-14">

        <h1 className="text-3xl font-bold text-indigo-900 mb-6">
          Create New Course
        </h1>

        <div className="bg-white rounded-xl shadow p-8 space-y-4">

          <input
            placeholder="Course title"
            className="w-full p-3 border rounded"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Course description"
            className="w-full p-3 border rounded"
            rows={4}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            placeholder="Category (e.g. Web Development)"
            className="w-full p-3 border rounded"
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Price"
              className="w-full p-3 border rounded"
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
              onChange={(e) =>
                setForm({
                  ...form,
                  capacity: Number(e.target.value),
                })
              }
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
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

          <button
            onClick={handleCreate}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg cursor-pointer"
          >
            Create Course
          </button>
        </div>
      </div>
    </section>
  );
}
