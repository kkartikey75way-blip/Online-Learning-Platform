import { useNavigate, useLocation } from "react-router-dom";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <header className="w-full bg-[#f9f7f2] border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">

        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-bold text-indigo-900"
        >
          Inter<span className="text-teal-500">.</span>
        </button>

        {/* NAV */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-indigo-900">
          <button
            onClick={() => navigate("/about")}
            className={`hover:text-teal-500 ${isActive("/about") && "text-teal-500"
              }`}
          >
            About
          </button>

          <button
            onClick={() => navigate("/courses")}
            className={`cursor-pointer hover:text-teal-500 ${isActive("/courses") && "text-teal-500"
              }`}
          >
            Courses
          </button>


          <button
            onClick={() => navigate("/team")}
            className="hover:text-teal-500"
          >
            Team
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="hover:text-teal-500"
          >
            Pricing
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="hover:text-teal-500"
          >
            Contact us
          </button>
        </nav>

        {/* AUTH ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer flex items-center gap-2 text-sm font-medium text-indigo-900 hover:text-teal-500 transition"
          >
            <FiLogIn />
            Login
          </button>

          {/* Signup */}
          <button
            onClick={() => navigate("/signup")}
            className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-600 transition text-white px-5 py-2 rounded-md text-sm font-medium"
          >
            <FiUserPlus />
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}
