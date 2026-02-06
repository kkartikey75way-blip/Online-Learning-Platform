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
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full"
          >
            <div className="flex-1 mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2 truncate" title={c.title}>{c.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                  {c.instructor.name.substring(0, 2)}
                </div>
                <span>{c.instructor.name}</span>
              </div>
              <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                {c.description || "No description provided."}
              </p>
            </div>

            <button
              onClick={() => navigate(`/courses/${c._id}`)}
              className="mt-auto w-full bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 group"
            >
              View Course
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
