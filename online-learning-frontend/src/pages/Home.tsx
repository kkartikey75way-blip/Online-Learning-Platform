import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { HiOutlineAcademicCap, HiOutlineSparkles, HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { BsChatDots } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRecommendedCourses } from "../services/course.service";
import { RootState } from "../store/store";
import InterestSelector from "../components/InterestSelector";
import { loginSuccess } from "../store/reducers/authReducer";
import { Course } from "../types/course.types";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [recommended, setRecommended] = useState<Course[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      loadRecommendations();
    }
  }, [isAuthenticated, user?.interests]);

  const loadRecommendations = async () => {
    try {
      const data = await getRecommendedCourses();
      setRecommended(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      navigate("/courses");
      return;
    }
    navigate(`/courses?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-[#f9f7f2] min-h-screen">
      <section>
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

      {/* RECOMMENDATIONS SECTION */}
      {recommended.length > 0 && (
        <section className="pb-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <HiOutlineSparkles size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-indigo-900">Recommended for You</h2>
                <p className="text-gray-500 font-medium">Based on your interests and popularity.</p>
              </div>
              <button
                onClick={() => setShowSelector(true)}
                className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-indigo-50 rounded-2xl text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <HiOutlineAdjustmentsVertical size={18} />
                Adjust Interests
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recommended.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/courses/${c._id}`)}
                  className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex flex-col h-full group cursor-pointer"
                >
                  <div className="flex-1 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-teal-600">
                      <span className="bg-teal-50 px-2.5 py-1 rounded-full">{c.category}</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                      {c.title}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs uppercase text-center overflow-hidden">
                        {c.instructor?.name?.substring(0, 2)}
                      </div>
                      <span className="font-bold">{c.instructor?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                    <span className="text-xl font-black text-indigo-900">${c.price || "Free"}</span>
                    <button className="text-indigo-600 font-bold text-sm group-hover:underline">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showSelector && (
        <InterestSelector
          initialInterests={user?.interests || []}
          onUpdate={(newInterests) => {
            dispatch(loginSuccess({ token: token!, user: { ...user, interests: newInterests } }));
            loadRecommendations();
          }}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
