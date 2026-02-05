import { useState } from "react";
import { submitAssignment } from "../services/assignment.service";

export default function AssignmentPage({ assignmentId }: any) {
  const [file, setFile] = useState<File | null>(null);

  const submit = async () => {
    if (!file) return;
    await submitAssignment(assignmentId, file);
    alert("Submitted successfully");
  };

  return (
    <div className="p-10">
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />
      <button
        onClick={submit}
        className="bg-teal-500 text-white px-4 py-2 ml-4"
      >
        Submit
      </button>
    </div>
  );
}
