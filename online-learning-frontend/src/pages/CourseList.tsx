import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../services/course.service";

export default function CourseList() {
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses().then(setCourses);
  }, []);

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c._id}
            className="bg-white p-6 rounded shadow"
          >
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-500">
              Instructor: {c.instructor.name}
            </p>

            <button
              onClick={() => navigate(`/courses/${c._id}`)}
              className="mt-4 text-teal-600 underline"
            >
              View course →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
