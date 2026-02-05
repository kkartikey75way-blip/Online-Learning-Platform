import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { ReactNode } from "react";

export default function PublicRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
