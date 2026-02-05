import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { ReactNode } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
