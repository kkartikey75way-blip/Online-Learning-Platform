import { useParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";

export default function AssignmentUpload() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [file, setFile] = useState<File | null>(null);

  const submitAssignment = async () => {
    if (!assignmentId || !file) {
      Swal.fire("Missing file", "Please upload a file", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assignmentId", assignmentId);

      await api.post("/assignments/submit", formData);

      Swal.fire(
        "Submitted",
        "Assignment uploaded successfully",
        "success"
      );
    } catch {
      Swal.fire("Failed", "Submission failed", "error");
    }
  };

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-900 mb-4">
        Submit Assignment
      </h1>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
        className="mb-4"
      />

      <button
        onClick={submitAssignment}
        className="bg-teal-500 text-white px-6 py-2 rounded cursor-pointer"
      >
        Submit
      </button>
    </div>
  );
}
