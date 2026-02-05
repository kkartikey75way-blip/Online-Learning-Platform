import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] flex items-center justify-center">
      <Outlet />
    </div>
  );
}
