import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";

import { InstructorStats, StudentAnalytic, Conversation } from "../types/instructor";
import { PerformanceSummary } from "../components/instructor/PerformanceSummary";
import { AnalyticsSection } from "../components/instructor/AnalyticsSection";
import { MessagesSection } from "../components/instructor/MessagesSection";

const InstructorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"performance" | "analytics" | "messages">("performance");
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentAnalytics, setStudentAnalytics] = useState<StudentAnalytic[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Conversation | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/instructor/stats");
      setStats(res.data);
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (courseId: string) => {
    setSelectedCourse(courseId);
    if (!courseId) {
      setStudentAnalytics([]);
      setConversations([]);
      setSelectedStudent(null);
      return;
    }

    if (activeTab === "analytics") {
      setAnalyticsLoading(true);
      try {
        const res = await api.get(`/instructor/analytics/${courseId}`);
        setStudentAnalytics(res.data);
      } catch (error: unknown) {
        console.error(error);
      } finally {
        setAnalyticsLoading(false);
      }
    } else if (activeTab === "messages") {
      try {
        const res = await api.get(`/messages/course/${courseId}/students`);
        setConversations(res.data);
        setSelectedStudent(null);
      } catch (error: unknown) {
        console.error(error);
      }
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Course?",
      text: "This will remove all associated content forever!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/courses/${id}`);
        Swal.fire("Deleted!", "Course has been removed.", "success");
        fetchStats();
      } catch (error: unknown) {
        Swal.fire("Error", "Failed to delete course", "error");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;
  if (!stats) return <div className="p-10 text-center">No data found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-indigo-900 tracking-tight">Instructor Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage your courses, students, and performance</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            {(["performance", "analytics", "messages"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedCourse("");
                }}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-gray-500 hover:bg-gray-50"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </header>

        {activeTab === "performance" && (
          <PerformanceSummary stats={stats} onDelete={handleDeleteCourse} onPublish={fetchStats} />
        )}

        {activeTab === "analytics" && (
          <AnalyticsSection
            courses={stats.courseStats}
            selectedCourse={selectedCourse}
            onCourseChange={handleCourseSelect}
            loading={analyticsLoading}
            data={studentAnalytics}
          />
        )}

        {activeTab === "messages" && (
          <MessagesSection
            courses={stats.courseStats}
            selectedCourse={selectedCourse}
            onCourseChange={handleCourseSelect}
            conversations={conversations}
            selectedStudent={selectedStudent}
            onStudentSelect={setSelectedStudent}
          />
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
