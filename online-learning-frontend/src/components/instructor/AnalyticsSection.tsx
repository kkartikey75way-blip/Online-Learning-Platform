import { CourseStat, StudentAnalytic } from "../../types/instructor";

interface AnalyticsSectionProps {
    courses: CourseStat[];
    selectedCourse: string;
    onCourseChange: (id: string) => void;
    loading: boolean;
    data: StudentAnalytic[];
}

export function AnalyticsSection({ courses, selectedCourse, onCourseChange, loading, data }: AnalyticsSectionProps) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Student Progress Analytics</h2>
                <select
                    className="border p-2 rounded w-64 text-sm"
                    value={selectedCourse}
                    onChange={(e) => onCourseChange(e.target.value)}
                >
                    <option value="">-- Select Course --</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>
            </div>

            {!selectedCourse ? (
                <div className="p-20 text-center text-gray-400">Please select a course to view student progress.</div>
            ) : loading ? (
                <div className="p-20 text-center text-gray-400">Loading student data...</div>
            ) : data.length === 0 ? (
                <div className="p-20 text-center text-gray-400">No students enrolled matching this criteria.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b text-gray-500 uppercase text-[10px] tracking-widest">
                                <th className="py-4 font-black">Student Name</th>
                                <th className="font-black">Email</th>
                                <th className="font-black text-center">Completion</th>
                                <th className="font-black">Progress Bar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((student) => (
                                <tr key={student._id} className="border-b last:border-none hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-bold text-gray-900">{student.user?.name}</td>
                                    <td className="text-gray-500">{student.user?.email}</td>
                                    <td className="text-center">
                                        <span className={`font-black ${student.progressPercent === 100 ? "text-green-600" : "text-indigo-600"}`}>
                                            {student.progressPercent}%
                                        </span>
                                    </td>
                                    <td className="w-1/3">
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${student.progressPercent === 100 ? "bg-green-500" : "bg-indigo-600"}`}
                                                style={{ width: `${student.progressPercent}%` }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
