import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PublicRoute from "./PublicRoute";

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    Loading...
  </div>
);

// Public
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const CourseList = lazy(() => import("../pages/CourseList"));
const CourseDetails = lazy(() => import("../pages/CourseDetails"));



// Student
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const Certificates = lazy(() => import("../pages/Certificate"));
const QuizPage = lazy(() => import("../pages/QuizPage"));
const AssignmentPage = lazy(() => import("../pages/AssignmentPage"));

// Instructor
const InstructorDashboard = lazy(() => import("../pages/InstructorDashboard"));
const CreateCourse = lazy(() => import("../pages/CreateCourse"));
const InstructorCourseBuilder = lazy(() => import("../pages/InstructorCourseBuilder"));

export const router = createBrowserRouter([
  // AUTH
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

  // VERIFY EMAIL
  {
    path: "/verify-email/:token",
    element: (
      <Suspense fallback={<Loader />}>
        <VerifyEmail />
      </Suspense>
    ),
  },

  // MAIN
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/courses", element: <CourseList /> },
      { path: "/courses/:id", element: <CourseDetails /> },

      // STUDENT
      {
        path: "/student",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/certificates",
        element: (
          <ProtectedRoute>
            <Certificates />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quiz/:lessonId",
        element: (
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assignment/:assignmentId",
        element: (
          <ProtectedRoute>
            <AssignmentPage />
          </ProtectedRoute>
        ),
      },

      // INSTRUCTOR
      {
        path: "/instructor",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <InstructorDashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/instructor/create-course",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <CreateCourse />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/instructor/course/:courseId/builder",
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <Suspense fallback={<Loader />}>
                <InstructorCourseBuilder />
              </Suspense>
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },

    ],
  },


]);
