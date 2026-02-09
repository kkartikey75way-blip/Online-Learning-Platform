import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../services/api";
import { InstructorStats } from "../../types/instructor";
import { StatCard } from "./StatCard";

interface PerformanceSummaryProps {
    stats: InstructorStats;
    onDelete: (id: string) => void;
    onPublish: () => void;
}

export function PerformanceSummary({ stats, onDelete, onPublish }: PerformanceSummaryProps) {
    const navigate = useNavigate();
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard label="Courses" value={stats.totalCourses} />
                <StatCard label="Enrollments" value={stats.totalEnrollments} />
                <StatCard label="Students" value={stats.totalStudents} />
                <StatCard label="Avg Completion" value={`${stats.averageCompletion}%`} />
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Course Performance</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2">Course</th>
                                <th>Enrolled</th>
                                <th>Capacity</th>
                                <th>Completion</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.courseStats.map((course) => (
                                <tr key={course.id} className="border-b last:border-none">
                                    <td className="py-2 font-medium">{course.title}</td>
                                    <td>{course.enrolled}</td>
                                    <td>{course.capacity}</td>
                                    <td>{course.completion}%</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-[10px] font-medium ${course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {course.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {!course.isPublished && (
                                                <button
                                                    onClick={() => api.patch(`/courses/${course.id}/publish`).then(() => {
                                                        Swal.fire("Published", "Course is live", "success");
                                                        onPublish();
                                                    })}
                                                    className="bg-teal-500 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Publish
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(course.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
