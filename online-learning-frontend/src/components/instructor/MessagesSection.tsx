import ChatModule from "../ChatModule";
import { CourseStat, Conversation } from "../../types/instructor";

interface MessagesSectionProps {
    courses: CourseStat[];
    selectedCourse: string;
    onCourseChange: (id: string) => void;
    conversations: Conversation[];
    selectedStudent: Conversation | null;
    onStudentSelect: (student: Conversation) => void;
}

export function MessagesSection({ courses, selectedCourse, onCourseChange, conversations, selectedStudent, onStudentSelect }: MessagesSectionProps) {
    const userStr = localStorage.getItem("user");
    const currentUserId = userStr ? JSON.parse(userStr)._id : "";

    return (
        <div className="flex gap-6 h-[600px]">
            <div className="w-1/3 bg-white rounded-xl shadow p-4 flex flex-col">
                <h3 className="font-bold mb-4 text-gray-800">Select Course</h3>
                <select
                    className="border p-2 rounded mb-6 w-full text-sm"
                    value={selectedCourse}
                    onChange={(e) => onCourseChange(e.target.value)}
                >
                    <option value="">-- Choose Course --</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>

                <h3 className="font-bold mb-2 text-gray-800">Student Inquiries</h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {!selectedCourse ? (
                        <p className="text-gray-400 text-xs text-center mt-10">Please select a course first.</p>
                    ) : conversations.length === 0 ? (
                        <p className="text-gray-400 text-xs text-center mt-10 italic">No messages found.</p>
                    ) : conversations.map((conv) => (
                        <div
                            key={conv.studentId}
                            onClick={() => onStudentSelect(conv)}
                            className={`p-3 border rounded-lg cursor-pointer transition ${selectedStudent?.studentId === conv.studentId ? "bg-indigo-600 text-white" : "bg-gray-50 hover:bg-gray-100"}`}
                        >
                            <div className="font-bold text-xs">{conv.lastMessage?.sender?.name || "Student"}</div>
                            <div className={`text-xs truncate mt-1 ${selectedStudent?.studentId === conv.studentId ? "text-indigo-100" : "text-gray-500"}`}>
                                {conv.lastMessage?.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow overflow-hidden flex flex-col min-h-[400px]">
                {selectedStudent ? (
                    <ChatModule
                        courseId={selectedCourse}
                        otherUserId={selectedStudent.studentId}
                        otherUserName={selectedStudent.lastMessage?.sender?.name || "Student"}
                        currentUserId={currentUserId}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                            <span className="text-3xl">💬</span>
                        </div>
                        <p className="text-sm">Select a conversation to reply</p>
                    </div>
                )}
            </div>
        </div>
    );
}
