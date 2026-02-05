import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { BsChatDots } from "react-icons/bs";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) {
      navigate("/courses");
      return;
    }
    navigate(`/courses?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="bg-[#f9f7f2]">
      <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-5xl font-extrabold text-indigo-900 leading-tight">
            <span className="relative inline-block mr-2">
              <span className="absolute inset-0 border-2 border-teal-400 rounded-full -z-10"></span>
              <span className="px-3 text-teal-500">Learn</span>
            </span>
            on your
            <br />
            schedule
            <FiClock className="inline ml-2 text-teal-500" />
          </h1>

          <p className="mt-6 text-gray-600 max-w-md">
            Anywhere, anytime. Start learning today with top
            mentors and flexible courses.
          </p>

          {/* SEARCH */}
          <div className="mt-8 flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="What do you want to learn?"
              className="flex-1 outline-none text-sm"
            />
            <button onClick={handleSearch}>
              <FiSearch className="text-gray-400 hover:text-teal-500" />
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/courses")}
            className="cursor-pointer mt-6 bg-teal-500 hover:bg-teal-600 transition text-white px-6 py-3 rounded-lg font-medium"
          >
            Get Started
          </button>

          {/* MENTORS */}
          <button
            onClick={() => navigate("/courses")}
            className="mt-6 flex items-center gap-3 text-sm text-gray-600 hover:text-teal-600"
          >
            <HiOutlineAcademicCap className="text-teal-500 text-lg" />
            <FiCheckCircle className="text-teal-500 text-lg" />
            <span>20K+ Verified Mentors</span>
          </button>
        </div>

        {/* RIGHT VISUALS */}
        <div className="relative flex items-center justify-center">

          {/* MAIN CTA CIRCLE */}
          <button
            onClick={() => navigate("/courses")}
            className="cursor-pointer w-72 h-72 rounded-full bg-linear-to-br from-teal-200 to-indigo-200 flex items-center justify-center shadow-lg hover:scale-105 transition"
          >
            <HiOutlineAcademicCap className="text-indigo-900 text-7xl" />
          </button>

          {/* FLOATING CTA */}
          <button
            onClick={() => navigate("/courses")}
            className="cursor-pointer absolute -top-6 right-10 bg-white px-4 py-2 rounded-full shadow flex items-center gap-2 text-sm hover:bg-teal-50"
          >
            <BsChatDots className="text-teal-500" />
            Nice platform
          </button>

          <button
            onClick={() => navigate("/courses")}
            className="cursor-pointer absolute bottom-10 left-4 bg-white px-4 py-2 rounded-full shadow flex items-center gap-2 text-sm hover:bg-green-50"
          >
            <FiCheckCircle className="text-green-500" />
            Enjoyed it
          </button>

          <button
            onClick={() => navigate("/courses")}
            className="absolute top-1/2 -left-8 bg-white px-4 py-2 rounded-full shadow flex items-center gap-2 text-sm hover:bg-indigo-50"
          >
            <FiClock className="text-indigo-500" />
            Flexible learning
          </button>
        </div>
      </div>
    </section>
  );
}
