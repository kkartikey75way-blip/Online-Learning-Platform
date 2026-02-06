import { useEffect, useState } from "react";
import { getModuleAssignment, submitAssignment, getMySubmission, getAssignmentById } from "../services/assignment.service";
import { HiOutlineDocumentText, HiOutlineLink, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi2";
import { useParams } from "react-router-dom";

export default function AssignmentPage({ moduleId }: { moduleId?: string }) {
  const { assignmentId: paramAssignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let assignData;
        if (moduleId) {
          assignData = await getModuleAssignment(moduleId);
        } else if (paramAssignmentId) {
          assignData = await getAssignmentById(paramAssignmentId); // Fallback or add service
        }

        setAssignment(assignData);

        if (assignData) {
          const subData = await getMySubmission(assignData._id);
          setSubmission(subData);
          if (subData) setLink(subData.link);
        }
      } catch (err) {
        console.error("Failed to load assignment data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link || !assignment) return;

    setSubmitting(true);
    try {
      const res = await submitAssignment(assignment._id, link);
      setSubmission(res);
      alert("Assignment submitted successfully!");
    } catch (err) {
      alert("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading module assignment...</div>;

  if (!assignment) return (
    <div className="p-10 text-center flex flex-col items-center justify-center h-full">
      <HiOutlineDocumentText size={48} className="text-gray-200 mb-4" />
      <h3 className="text-xl font-bold text-gray-400">No assignment for this module yet</h3>
    </div>
  );

  return (
    <div className="w-full h-full overflow-y-auto bg-white">
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b pb-6">
          <div className="bg-indigo-100 p-3 rounded-2xl">
            <HiOutlineDocumentText className="text-indigo-600" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {assignment.title}
            </h2>
            <p className="text-gray-500 font-medium">Module Assignment</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            Instructions
          </h3>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
            {assignment.description}
          </div>
        </div>

        <div className="bg-white border-2 border-indigo-50 rounded-3xl p-8 shadow-xl shadow-indigo-500/5">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center justify-between">
            Your Submission
            {submission ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                <HiOutlineCheckCircle size={14} /> Submitted
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                <HiOutlineClock size={14} /> Pending
              </span>
            )}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">
                Project Link (GitHub, Drive, or Website)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineLink className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/your-username/project"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400 font-medium italic">
                {submission
                  ? `Last updated on ${new Date(submission.submittedAt).toLocaleString()}`
                  : "You can update your link until the instructor grades it."}
              </p>
              <button
                type="submit"
                disabled={submitting || !link}
                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
              >
                {submitting ? "Submitting..." : submission ? "Update Submission" : "Submit Assignment"}
              </button>
            </div>
          </form>

          {submission?.grade !== undefined && (
            <div className="mt-8 bg-white border border-indigo-100 rounded-[32px] overflow-hidden shadow-sm">
              <div className="bg-indigo-600 p-6 sm:p-8 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-teal-300" /> Assignment Result
                </h3>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid md:grid-cols-[160px,1fr] gap-8">
                  <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100">
                    <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-1">Final Grade</p>
                    <p className="text-5xl font-black text-indigo-900">{submission.grade}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 pl-1">Instructor Feedback</p>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 italic text-gray-700 leading-relaxed font-medium">
                      {submission.feedback || "Great job completing this module! Keep up the good work."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {submission && submission.grade === undefined && submission.feedback && (
            <div className="mt-8 bg-teal-50 border border-teal-100 rounded-2xl p-6">
              <h4 className="font-bold text-teal-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <HiOutlineDocumentText className="text-teal-600" /> Instructor Feedback
              </h4>
              <div className="text-teal-800 italic leading-relaxed font-medium">
                {submission.feedback}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
