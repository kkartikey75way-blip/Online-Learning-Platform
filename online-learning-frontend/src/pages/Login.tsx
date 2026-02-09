import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../services/api";
import { loginSuccess } from "../store/reducers/authReducer";
import type { AppDispatch } from "../store/store";

import { loginSchema, LoginFormValues } from "../schemas/auth.schema";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const redirectByRole = (role: "INSTRUCTOR" | "STUDENT") => {
    navigate(role === "INSTRUCTOR" ? "/instructor" : "/student");
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await api.post("/auth/login", data);

      // ✅ SAVE TOKENS
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      // ✅ UPDATE REDUX
      dispatch(loginSuccess(res.data));

      // ✅ ROLE REDIRECT
      redirectByRole(res.data.user.role);
    } catch (error: unknown) {
      const message =
        error instanceof Error && (error as any).response?.data?.message
          ? (error as any).response.data.message
          : "Invalid credentials";
      Swal.fire("Login failed", message, "error");
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      const res = await api.post("/auth/google", {
        idToken: credential,
      });

      // ✅ SAVE TOKENS
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              className={`w-full p-3 border rounded ${errors.email ? "border-red-500" : ""
                }`}
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              className={`w-full p-3 border rounded ${errors.password ? "border-red-500" : ""
                }`}
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded mb-4 cursor-pointer hover:bg-teal-600 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm mb-4 text-gray-500">
          or continue with
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) =>
              res.credential && handleGoogleLogin(res.credential)
            }
            onError={() => Swal.fire("Google login failed", "", "error")}
          />
        </div>
      </div>
    </div>
  );
}
