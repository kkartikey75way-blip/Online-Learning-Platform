import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlinePlus,
} from "react-icons/hi2";

interface Course {
  _id: string;
  title: string;
  category: string;
  enrolledCount: number;
  isPublished: boolean;
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/courses/my-courses")
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-[#f9f7f2]">
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your courses and students
            </p>
          </div>

          <button
            onClick={() => navigate("/instructor/create-course")}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-3 rounded-lg font-medium cursor-pointer"
          >
            <HiOutlinePlus />
            Create Course
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<HiOutlineBookOpen />}
            label="Total Courses"
            value={courses.length}
          />
          <StatCard
            icon={<HiOutlineUsers />}
            label="Total Students"
            value={courses.reduce(
              (sum, c) => sum + c.enrolledCount,
              0
            )}
          />
          <StatCard
            icon={<HiOutlineBookOpen />}
            label="Published Courses"
            value={courses.filter((c) => c.isPublished).length}
          />
        </div>

        {/* COURSES */}
        <h2 className="text-xl font-semibold text-indigo-900 mb-4">
          Your Courses
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading courses…</p>
        ) : courses.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-600">
            You haven’t created any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg text-indigo-900">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Category: {course.category}
                  </p>

                  <p className="text-sm mt-2 text-gray-600">
                    Students enrolled:{" "}
                    <span className="font-medium">
                      {course.enrolledCount}
                    </span>
                  </p>

                  <p
                    className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                      course.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.isPublished
                      ? "Published"
                      : "Draft"}
                  </p>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() =>
                      navigate(`/courses/${course._id}`)
                    }
                    className="text-sm text-teal-600 hover:underline cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/instructor/course/${course._id}`
                      )
                    }
                    className="text-sm text-indigo-600 hover:underline cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex items-center gap-4">
      <div className="text-teal-500 text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-indigo-900">
          {value}
        </p>
      </div>
    </div>
  );
}
