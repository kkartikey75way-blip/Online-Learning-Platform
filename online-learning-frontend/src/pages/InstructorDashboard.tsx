import { useEffect, useState } from "react";
import { getInstructorStats } from "../services/instructor.service";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ChatModule from "../components/ChatModule";

interface CourseStat {
  id: string;
  title: string;
  enrolled: number;
  capacity: number;
  completion: number;
  isPublished: boolean;
}

export default function InstructorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"performance" | "messages" | "analytics">("performance");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [studentAnalytics, setStudentAnalytics] = useState<any[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getInstructorStats().then(setStats);
  }, []);

  const fetchAnalytics = async (courseId: string) => {
    setLoadingAnalytics(true);
    try {
      const res = await api.get(`/instructor/course/${courseId}/analytics`);
      setStudentAnalytics(res.data);
    } catch (e) {
      console.error("Failed to fetch analytics");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchConversations = async (courseId: string) => {
    try {
      const res = await api.get(`/messages/course/${courseId}/students`);
      setConversations(res.data);
    } catch (e) {
      console.error("Failed to fetch conversations");
    }
  };

  const handleDelete = async (courseId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/courses/${courseId}`);
        Swal.fire("Deleted!", "Your course has been deleted.", "success");
        const updatedStats = await getInstructorStats();
        setStats(updatedStats);
      } catch (error) {
        Swal.fire("Error", "Failed to delete course", "error");
      }
    }
  };

  if (!stats) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">Instructor Dashboard</h1>
        <button
          onClick={() => navigate("/instructor/create-course")}
          className="bg-teal-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Create Course
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b mb-6 border-gray-200">
        <button
          onClick={() => setActiveTab("performance")}
          className={`px-6 py-2 font-semibold transition ${activeTab === "performance" ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-gray-500 hover:text-gray-700"}`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-6 py-2 font-semibold transition ${activeTab === "messages" ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-gray-500 hover:text-gray-700"}`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-2 font-semibold transition ${activeTab === "analytics" ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-gray-500 hover:text-gray-700"}`}
        >
          Analytics
        </button>
      </div>

      {activeTab === "performance" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <StatCard label="Courses" value={stats.totalCourses} />
            <StatCard label="Enrollments" value={stats.totalEnrollments} />
            <StatCard label="Students" value={stats.totalStudents} />
            <StatCard label="Avg Completion" value={`${stats.averageCompletion}%`} />
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Course Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Course</th>
                    <th>Enrolled</th>
                    <th>Capacity</th>
                    <th>Completion</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.courseStats.map((course: CourseStat) => (
                    <tr key={course.id} className="border-b last:border-none">
                      <td className="py-2 font-medium">{course.title}</td>
                      <td>{course.enrolled}</td>
                      <td>{course.capacity}</td>
                      <td>{course.completion}%</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-[10px] font-medium ${course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {!course.isPublished && (
                            <button
                              onClick={() => api.patch(`/courses/${course.id}/publish`).then(() => {
                                Swal.fire("Published", "Course is live", "success");
                                getInstructorStats().then(setStats);
                              })}
                              className="bg-teal-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeTab === "analytics" ? (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Student Progress Analytics</h2>
            <select
              className="border p-2 rounded w-64 text-sm"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                if (e.target.value) fetchAnalytics(e.target.value);
              }}
            >
              <option value="">-- Select Course --</option>
              {stats.courseStats.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {!selectedCourse ? (
            <div className="p-20 text-center text-gray-400">
              Please select a course to view student progress.
            </div>
          ) : loadingAnalytics ? (
            <div className="p-20 text-center text-gray-400">Loading student data...</div>
          ) : studentAnalytics.length === 0 ? (
            <div className="p-20 text-center text-gray-400">No students enrolled matching this criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-gray-500 uppercase text-[10px] tracking-widest">
                    <th className="py-4 font-black">Student Name</th>
                    <th className="font-black">Email</th>
                    <th className="font-black text-center">Completion</th>
                    <th className="font-black">Progress Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAnalytics.map((student: any) => (
                    <tr key={student._id} className="border-b last:border-none hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-gray-900">{student.user?.name}</td>
                      <td className="text-gray-500">{student.user?.email}</td>
                      <td className="text-center">
                        <span className={`font-black ${student.progressPercent === 100 ? "text-green-600" : "text-indigo-600"}`}>
                          {student.progressPercent}%
                        </span>
                      </td>
                      <td className="w-1/3">
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${student.progressPercent === 100 ? "bg-green-500" : "bg-indigo-600"}`}
                            style={{ width: `${student.progressPercent}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-6 h-[600px]">
          <div className="w-1/3 bg-white rounded-xl shadow p-4 flex flex-col">
            <h3 className="font-bold mb-4 text-gray-800">Select Course</h3>
            <select
              className="border p-2 rounded mb-6 w-full text-sm"
              value={selectedCourse}
              onChange={(e) => {
                const cid = e.target.value;
                setSelectedCourse(cid);
                if (cid) fetchConversations(cid);
                setSelectedStudent(null);
              }}
            >
              <option value="">-- Choose Course --</option>
              {stats.courseStats.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>

            <h3 className="font-bold mb-2 text-gray-800">Student Inquiries</h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {!selectedCourse ? (
                <p className="text-gray-400 text-xs text-center mt-10">Please select a course first.</p>
              ) : conversations.length === 0 ? (
                <p className="text-gray-400 text-xs text-center mt-10 italic">No messages found.</p>
              ) : conversations.map((conv: any) => (
                <div
                  key={conv.studentId}
                  onClick={() => setSelectedStudent(conv)}
                  className={`p-3 border rounded-lg cursor-pointer transition ${selectedStudent?.studentId === conv.studentId ? "bg-indigo-600 text-white" : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="font-bold text-xs">{conv.lastMessage?.sender?.name || "Student"}</div>
                  <div className={`text-xs truncate mt-1 ${selectedStudent?.studentId === conv.studentId ? "text-indigo-100" : "text-gray-500"}`}>
                    {conv.lastMessage?.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow overflow-hidden flex flex-col min-h-[400px]">
            {selectedStudent ? (
              <ChatModule
                courseId={selectedCourse}
                otherUserId={selectedStudent.studentId}
                otherUserName={selectedStudent.lastMessage?.sender?.name || "Student"}
                currentUserId={JSON.parse(localStorage.getItem("user") || "{}")._id}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <ChatModule courseId="" otherUserId="" otherUserName="" currentUserId="" /> {/* Skeleton-like icon if I had one */}
                </div>
                <p className="text-sm">Select a conversation to reply</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-indigo-900">{value}</p>
    </div>
  );
}
