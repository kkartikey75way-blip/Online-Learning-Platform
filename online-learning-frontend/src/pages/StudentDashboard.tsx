import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  HiOutlineBookOpen,
  HiOutlineChartBar,
} from "react-icons/hi2";

interface Enrollment {
  _id: string;
  progressPercent: number;
  course: {
    _id: string;
    title: string;
    instructor: {
      name: string;
    };
  };
}

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/courses/my-enrollments")
      .then((res) => setEnrollments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-[#f9f7f2]">
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-indigo-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Continue learning where you left off
          </p>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading your courses…</p>
        ) : enrollments.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-600">
            You are not enrolled in any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrollments.map((enroll) => (
              <div
                key={enroll._id}
                className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-indigo-900">
                    <HiOutlineBookOpen />
                    <h2 className="font-semibold text-lg">
                      {enroll.course.title}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">
                    Instructor: {enroll.course.instructor.name}
                  </p>

                  {/* PROGRESS */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <HiOutlineChartBar />
                      Progress
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-teal-500 h-2 rounded transition-all"
                        style={{
                          width: `${enroll.progressPercent}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {enroll.progressPercent}% completed
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/courses/${enroll.course._id}`)
                  }
                  className="mt-6 text-teal-600 hover:underline text-sm cursor-pointer"
                >
                  Continue learning →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
