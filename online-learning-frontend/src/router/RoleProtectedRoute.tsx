import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { ReactNode } from "react";

export default function RoleProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: ReactNode;
}) {
  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!user) return null; // wait for auth

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
