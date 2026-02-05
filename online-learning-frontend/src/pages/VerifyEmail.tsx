import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../services/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);

        await Swal.fire({
          icon: "success",
          title: res.data.alreadyVerified
            ? "Email already verified !!"
            : "Email verified !",
          text: "You can now login to your account.",
          confirmButtonColor: "#14b8a6",
        });

        navigate("/login");
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Verification failed",
          text:
            error?.response?.data?.message ||
            "Invalid or expired link",
        });
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#f9f7f2] flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-indigo-900 mb-2">
          Verifying your email…
        </h1>
        <p className="text-gray-600">
          Please wait a moment
        </p>
      </div>
    </div>
  );
}
