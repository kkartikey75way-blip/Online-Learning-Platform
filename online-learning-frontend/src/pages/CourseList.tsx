import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllCourses, getCoursesByInstructor } from "../services/course.service";
import { HiOutlineUser, HiOutlineTag } from "react-icons/hi2";

import { Course } from "../types/course.types";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const instructorId = searchParams.get("instructor");

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        if (instructorId) {
          const data = await getCoursesByInstructor(instructorId);
          setCourses(data);
        } else {
          const data = await getAllCourses();
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [instructorId]);

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-indigo-900 leading-tight">
            {instructorId ? (
              <>Courses by <span className="text-teal-600">{courses[0]?.instructor?.name || "Instructor"}</span></>
            ) : "Explore Courses"}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Discover world-class learning experiences.</p>
        </div>
        {instructorId && (
          <button
            onClick={() => navigate("/courses")}
            className="self-start px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            Show All Courses
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <HiOutlineTag className="mx-auto text-gray-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-400">No courses found</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((c) => (
            <div
              key={c._id}
              className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex flex-col h-full group"
            >
              <div className="flex-1 mb-6">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-teal-600">
                  <span className="bg-teal-50 px-2.5 py-1 rounded-full">{c.category}</span>
                  <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">{c.capacity - c.enrolledCount} Seats Left</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors" title={c.title}>
                  {c.title}
                </h2>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/courses?instructor=${c.instructor._id}`);
                  }}
                  className="flex items-center gap-3 text-sm text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs uppercase">
                    {c.instructor.name.substring(0, 2)}
                  </div>
                  <span className="font-bold">{c.instructor.name}</span>
                </div>
                <p className="mt-4 text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium italic">
                  "{c.description || "No description provided."}"
                </p>
              </div>

              <button
                onClick={() => navigate(`/courses/${c._id}`)}
                className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-100 group"
              >
                Enroll Now
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
