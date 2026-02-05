import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../services/course.service";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

interface Course {
  _id: string;
  title: string;
  category: string;
  price: number;
  instructor: { name: string };
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses().then(setCourses);
  }, []);

  return (
    <section className="min-h-screen bg-[#f9f7f2]">
      <div className="max-w-7xl mx-auto px-8 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-900 flex items-center gap-3">
            <HiOutlineBookOpen className="text-teal-500" />
            Courses
          </h1>
          <p className="text-gray-600 mt-2">
            Explore expert-led courses and start learning today
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <button
              key={course._id}
              onClick={() => navigate(`/courses/${course._id}`)}
              className="text-left bg-white rounded-2xl p-6 shadow hover:shadow-xl transition hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-teal-50 text-teal-600">
                  {course.category}
                </span>
                <FiArrowRight className="text-gray-400" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-indigo-900 mb-2">
                {course.title}
              </h2>

              {/* Instructor */}
              <p className="text-sm text-gray-500">
                By {course.instructor?.name ?? "Instructor"}
              </p>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </span>
                <span className="text-sm text-teal-600 font-medium">
                  View details
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {courses.length === 0 && (
          <p className="text-center text-gray-500 mt-20">
            No courses available right now
          </p>
        )}
      </div>
    </section>
  );
}
