import { useEffect, useState } from "react";
import { getInstructorStats } from "../services/instructor.service";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"

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
  const navigate = useNavigate();

  useEffect(() => {
    getInstructorStats().then(setStats);
  }, []);

  const togglePublish = async (courseId: string) => {
    try {
      await api.patch(`/courses/${courseId}/publish`);

      const updatedStats = await getInstructorStats();
      setStats(updatedStats);
    } catch {
      alert("Failed to update publish status");
    }
  };

  if (!stats) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">
          Instructor Dashboard
        </h1>

        <button
          onClick={() => navigate("/instructor/create-course")}
          className="bg-teal-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Create Course
        </button>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Courses" value={stats.totalCourses} />
        <StatCard label="Enrollments" value={stats.totalEnrollments} />
        <StatCard label="Students" value={stats.totalStudents} />
        <StatCard
          label="Avg Completion"
          value={`${stats.averageCompletion}%`}
        />
      </div>

      {/* COURSE TABLE */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Course Performance
        </h2>

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
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${course.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>


                <td>
                  <button
                    onClick={() =>
                      api
                        .patch(`/courses/${course.id}/publish`)
                        .then(() => {
                          Swal.fire("Published", "Course is live", "success");
                          setStats((prev: any) => ({
                            ...prev,
                            courseStats: prev.courseStats.map((c: any) =>
                              c.id === course.id
                                ? { ...c, isPublished: true }
                                : c
                            ),
                          }));
                        })
                        .catch((err) =>
                          Swal.fire(
                            "Failed",
                            err?.response?.data?.message || "Publish failed",
                            "error"
                          )
                        )
                    }
                    disabled={course.isPublished}
                    className={`px-3 py-1 rounded text-sm ${course.isPublished
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-teal-500 text-white"
                      }`}
                  >
                    {course.isPublished ? "Published" : "Publish"}
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-indigo-900">{value}</p>
    </div>
  );
}
