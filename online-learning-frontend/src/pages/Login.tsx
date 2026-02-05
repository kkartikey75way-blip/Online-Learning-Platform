import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../services/api";
import { loginSuccess } from "../store/reducers/authReducer";
import type { AppDispatch } from "../store/store";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectByRole = (role: "INSTRUCTOR" | "STUDENT") => {
    navigate(role === "INSTRUCTOR" ? "/instructor" : "/student");
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // ✅ SAVE TOKEN (THIS WAS MISSING)
      localStorage.setItem("token", res.data.token);

      // ✅ UPDATE REDUX
      dispatch(loginSuccess(res.data));

      // ✅ ROLE REDIRECT
      redirectByRole(res.data.user.role);
    } catch (error: any) {
      Swal.fire(
        "Login failed",
        error?.response?.data?.message || "Invalid credentials",
        "error"
      );
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      const res = await api.post("/auth/google", {
        idToken: credential,
      });

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      dispatch(loginSuccess(res.data));
      redirectByRole(res.data.user.role);
    } catch {
      Swal.fire("Google login failed", "", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f2] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">
          Welcome back
        </h1>

        <input
          className="w-full mb-3 p-3 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 border rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-teal-500 text-white py-3 rounded mb-4 cursor-pointer"
        >
          Login
        </button>

        <div className="text-center text-sm mb-4 text-gray-500">
          or continue with
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) =>
              res.credential && handleGoogleLogin(res.credential)
            }
            onError={() =>
              Swal.fire("Google login failed", "", "error")
            }
          />
        </div>
      </div>
    </div>
  );
}
