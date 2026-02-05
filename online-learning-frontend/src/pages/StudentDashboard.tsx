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
                className="bg-white rounded-xl p-6 shadow"
              >
                <h2 className="text-lg font-semibold text-indigo-900 mb-1">
                  {enroll.course.title}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  Instructor: {enroll.course.instructor.name}
                </p>

                {/* PROGRESS BAR */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-teal-500 h-2 rounded"
                      style={{
                        width: `${enroll.progressPercent ?? 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {enroll.progressPercent ?? 0}% completed
                  </p>
                </div>

                {/* ACTIONS */}
                <button
                  onClick={() =>
                    navigate(`/courses/${enroll.course._id}`)
                  }
                  className="w-full text-sm bg-indigo-900 text-white py-2 rounded hover:bg-indigo-800"
                >
                  Continue Learning →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
