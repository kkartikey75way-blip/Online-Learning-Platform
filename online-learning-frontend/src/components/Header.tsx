import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/reducers/authReducer";
import {
  FiLogOut,
  FiUser,
  FiBookOpen,
  FiPlus,
} from "react-icons/fi";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const isActive = (path: string) =>
    location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="w-full bg-[#f9f7f2] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-indigo-900 cursor-pointer"
        >
          Inter<span className="text-teal-500">.</span>
        </button>

        {/* NAV */}
        <nav className="flex items-center gap-6 text-sm font-medium">

          {/* PUBLIC */}
          {!isAuthenticated && (
            <>
              <NavBtn
                label="Courses"
                onClick={() => navigate("/courses")}
                active={isActive("/courses")}
              />
              <NavBtn
                label="Login"
                onClick={() => navigate("/login")}
              />
              <NavBtn
                label="Signup"
                onClick={() => navigate("/signup")}
              />
            </>
          )}

          {/* STUDENT */}
          {isAuthenticated &&
            user?.role === "STUDENT" && (
              <>
                <NavBtn
                  label="Courses"
                  icon={<FiBookOpen />}
                  onClick={() => navigate("/courses")}
                />
                <NavBtn
                  label="Dashboard"
                  icon={<FiUser />}
                  onClick={() => navigate("/student")}
                />
                <NavBtn
                  label="Certificates"
                  onClick={() =>
                    navigate("/certificates")
                  }
                />
              </>
            )}

          {/* INSTRUCTOR */}
          {isAuthenticated &&
            user?.role === "INSTRUCTOR" && (
              <>
                <NavBtn
                  label="Dashboard"
                  icon={<FiUser />}
                  onClick={() => navigate("/instructor")}
                />
                <NavBtn
                  label="Create Course"
                  icon={<FiPlus />}
                  onClick={() =>
                    navigate("/instructor/create-course")
                  }
                />
              </>
            )}

          {/* LOGOUT */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 cursor-pointer"
            >
              <FiLogOut />
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

//SMALL COMPONENT

function NavBtn({
  label,
  onClick,
  active,
  icon,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 cursor-pointer hover:text-teal-500 ${
        active ? "text-teal-500" : "text-indigo-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
