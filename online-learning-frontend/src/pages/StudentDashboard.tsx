import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEnrolledCourses } from "../services/course.service";

interface Enrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    instructor: { name: string };
  };
}

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyEnrolledCourses().then(setEnrollments);
  }, []);

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">
        Student Dashboard
      </h1>

      {enrollments.length === 0 ? (
        <p className="text-gray-600">
          You are not enrolled in any courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enrollments.map((enroll) => (
            <div
              key={enroll._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h2 className="text-lg font-semibold">
                {enroll.course.title}
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                Instructor: {enroll.course.instructor.name}
              </p>

              <button
                onClick={() =>
                  navigate(`/courses/${enroll.course._id}`)
                }
                className="text-teal-500 hover:underline cursor-pointer"
              >
                Continue learning →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
