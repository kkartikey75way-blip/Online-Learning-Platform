import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PublicRoute from "./PublicRoute";

/* Lazy pages */
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const CourseList = lazy(() => import("../pages/CourseList"));
const CourseDetails = lazy(() => import("../pages/CourseDetails"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const InstructorDashboard = lazy(() => import("../pages/InstructorDashboard"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const QuizPage = lazy(() => import("../pages/QuizPage"));
const AssignmentUpload = lazy(() => import("../pages/AssignmentUpload"));
const CertificatePage = lazy(() => import("../pages/CertificatePage"));


// Loader 
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-lg animate-pulse">Loading...</p>
  </div>
);

export const router = createBrowserRouter([

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <Suspense fallback={<Loader />}>
              <Signup />
            </Suspense>
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: "/verify-email/:token",
    element: (
      <Suspense fallback={<Loader />}>
        <VerifyEmail />
      </Suspense>
    ),
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },

      {
        path: "/courses",
        element: (
          <Suspense fallback={<Loader />}>
            <CourseList />
          </Suspense>
        ),
      },

      {
        path: "/courses/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <CourseDetails />
          </Suspense>
        ),
      },

      {
        path: "/student",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["STUDENT"]}>
              <Suspense fallback={<Loader />}>
                <StudentDashboard />
              </Suspense>
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },

      {
        path: "/instructor",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <Suspense fallback={<Loader />}>
                <InstructorDashboard />
              </Suspense>
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },

      {
        path: "/unauthorized",
        element: (
          <Suspense fallback={<Loader />}>
            <Unauthorized />
          </Suspense>
        ),
      },
      {
        path: "/quiz/:quizId",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["STUDENT"]}>
              <Suspense fallback={<Loader />}>
                <QuizPage />
              </Suspense>
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },

      {
        path: "/assignment/:assignmentId",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["STUDENT"]}>
              <Suspense fallback={<Loader />}>
                <AssignmentUpload />
              </Suspense>
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },

      {
        path: "/certificate/:courseId",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["STUDENT"]}>
              <Suspense fallback={<Loader />}>
                <CertificatePage />
              </Suspense>
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },

    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
