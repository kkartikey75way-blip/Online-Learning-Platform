import { useState } from "react";
import { submitAssignment } from "../services/assignment.service";

export default function AssignmentPage({ assignmentId }: any) {
  const [fileUrl, setFileUrl] = useState("");

  const submit = async () => {
    if (!fileUrl) return;
    await submitAssignment(assignmentId, fileUrl);
    alert("Submitted successfully");
  };

  return (
    <div className="p-10">
      <input
        type="text"
        placeholder="Enter file URL"
        className="p-2 border rounded"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
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
