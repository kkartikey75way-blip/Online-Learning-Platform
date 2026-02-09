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
import { getErrorMessage } from "../utils/error-utils";

import { signupSchema, SignupFormValues } from "../schemas/auth.schema";

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await api.post("/auth/register", data);

      await Swal.fire({
        icon: "success",
        title: "Verification email sent",
        text: "Please verify your email before logging in",
        confirmButtonColor: "#14b8a6",
      });

      navigate("/login");
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Something went wrong");
      Swal.fire("Signup failed", message, "error");
    }
  };

  const handleGoogleSignup = async (credential: string) => {
    try {
      const res = await api.post("/auth/google", {
        idToken: credential,
        role: selectedRole,
      });

      dispatch(loginSuccess(res.data));

      navigate(
        res.data.user.role === "INSTRUCTOR" ? "/instructor" : "/student"
      );
    } catch {
      Swal.fire("Google signup failed", "", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f2] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow">
        <h1 className="text-3xl font-bold mb-6 text-indigo-900">
          Create account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ROLE SELECT */}
          <div className="flex gap-4 mb-4">
            {(["STUDENT", "INSTRUCTOR"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setValue("role", r)}
                className={`flex-1 py-2 rounded border text-sm font-medium cursor-pointer ${selectedRole === r
                  ? "bg-teal-500 text-white border-teal-500"
                  : "border-gray-300 text-gray-600"
                  }`}
              >
                {r === "STUDENT" ? "Student" : "Instructor"}
              </button>
            ))}
          </div>

          <div className="mb-3">
            <input
              placeholder="Name"
              className={`w-full p-3 border rounded ${errors.name ? "border-red-500" : ""
                }`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <input
              placeholder="Email"
              className={`w-full p-3 border rounded ${errors.email ? "border-red-500" : ""
                }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 border rounded ${errors.password ? "border-red-500" : ""
                }`}
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
            className="w-full bg-teal-500 text-white py-3 rounded mb-4 hover:bg-teal-600 transition cursor-pointer"
          >
            Sign up
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mb-4">
          or continue with
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) =>
              res.credential && handleGoogleSignup(res.credential)
            }
            onError={() => Swal.fire("Google signup failed", "", "error")}
          />
        </div>
      </div>
    </div>
  );
}
