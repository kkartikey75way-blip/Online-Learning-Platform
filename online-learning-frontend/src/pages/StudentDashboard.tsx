import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEnrolledCourses } from "../services/course.service";
import { HiOutlineAcademicCap } from "react-icons/hi2";

interface Enrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    instructor: {
      name: string;
    };
  };
  progressPercent?: number;
}

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyEnrolledCourses()
      .then((res) => setEnrollments(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-10">Loading your courses...</div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f9f7f2]">
      <div className="max-w-6xl mx-auto px-8 py-14">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-indigo-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            Track your learning progress
          </p>
        </div>

        {/* EMPTY STATE */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-xl p-10 shadow text-center">
            <HiOutlineAcademicCap className="text-4xl text-teal-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              You haven’t enrolled in any courses yet
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          /* COURSE GRID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrollments.map((enroll) => (
              <div
                key={enroll._id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
              >
                <div className="mb-4 flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {enroll.course.title}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    Instructor: <span className="text-indigo-600">{enroll.course.instructor.name}</span>
                  </p>
                </div>

                {/* PROGRESS BAR */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(enroll.progressPercent ?? 0)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${enroll.progressPercent ?? 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <button
                  onClick={() =>
                    navigate(`/courses/${enroll.course._id}`)
                  }
                  className="w-full text-sm font-semibold bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex justify-between items-center px-4 group"
                >
                  <span>Continue Learning</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
