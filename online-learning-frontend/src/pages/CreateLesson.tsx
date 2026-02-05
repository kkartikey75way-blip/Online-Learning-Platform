import { useState } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";

export default function CreateLesson({ moduleId }: { moduleId: string }) {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(null);

  const submit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("moduleId", moduleId);
    if (video) formData.append("video", video);

    await api.post("/lessons", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    Swal.fire("Lesson created", "", "success");
  };

  return (
    <div className="space-y-4">
      <input
        placeholder="Lesson title"
        className="border p-2 w-full"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files?.[0] || null)}
      />

      <button
        onClick={submit}
        className="bg-teal-500 text-white px-4 py-2 rounded"
      >
        Create Lesson
      </button>
    </div>
  );
}
