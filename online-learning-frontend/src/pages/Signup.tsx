import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../services/api";
import { loginSuccess } from "../store/reducers/authReducer";
import type { AppDispatch } from "../store/store";

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT" as "STUDENT" | "INSTRUCTOR",
  });

  const register = async () => {
    try {
      const res = await api.post("/auth/register", form);

      await Swal.fire({
        icon: "success",
        title: "Verification email sent 📩",
        text: "Please verify your email before logging in",
        confirmButtonColor: "#14b8a6",
      });

      navigate("/login");
    } catch (error: any) {
      Swal.fire(
        "Signup failed",
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };


  const handleGoogleSignup = async (credential: string) => {
    try {
      const res = await api.post("/auth/google", {
        idToken: credential,
        role: form.role,
      });

      dispatch(loginSuccess(res.data));

      navigate(
        res.data.user.role === "INSTRUCTOR"
          ? "/instructor"
          : "/student"
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

        {/* ROLE SELECT */}
        <div className="flex gap-4 mb-4">
          {["STUDENT", "INSTRUCTOR"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  role: r as "STUDENT" | "INSTRUCTOR",
                })
              }
              className={`flex-1 py-2 rounded border text-sm font-medium cursor-pointer ${form.role === r
                  ? "bg-teal-500 text-white border-teal-500"
                  : "border-gray-300 text-gray-600"
                }`}
            >
              {r === "STUDENT" ? "Student" : "Instructor"}
            </button>
          ))}
        </div>

        <input
          placeholder="Name"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          onClick={register}
          className="w-full bg-teal-500 text-white py-3 rounded mb-4 hover:bg-teal-600 transition cursor-pointer"
        >
          Sign up
        </button>

        <div className="text-center text-sm text-gray-500 mb-4">
          or continue with
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) =>
              res.credential &&
              handleGoogleSignup(res.credential)
            }
            onError={() =>
              Swal.fire("Google signup failed", "", "error")
            }
          />
        </div>
      </div>
    </div>
  );
}
