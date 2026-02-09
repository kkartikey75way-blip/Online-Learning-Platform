import { Course } from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import { Progress } from "../models/progress.model";

export class InstructorService {
    static async getStats(instructorId: string) {
        const courses = await Course.find({ instructor: instructorId });
        const courseIds = courses.map((c) => c._id);

        const enrollments = await Enrollment.find({ course: { $in: courseIds } });
        const uniqueStudents = new Set(enrollments.map((e) => e.user.toString()));

        const progress = await Progress.find({ course: { $in: courseIds } });

        const averageCompletion =
            progress.length === 0
                ? 0
                : Math.round(
                    progress.reduce((sum, p) => sum + p.progressPercent, 0) / progress.length
                );

        const courseStats = courses.map((course) => {
            const courseEnrollments = enrollments.filter(
                (e) => e.course.toString() === course._id.toString()
            );

            const courseProgress = progress.filter(
                (p) => p.course.toString() === course._id.toString()
            );

            const completion =
                courseProgress.length === 0
                    ? 0
                    : Math.round(
                        courseProgress.reduce((s, p) => s + p.progressPercent, 0) / courseProgress.length
                    );

            return {
                id: course._id,
                title: course.title,
                enrolled: courseEnrollments.length,
                capacity: course.capacity,
                completion,
                isPublished: course.isPublished,
            };
        });

        return {
            totalCourses: courses.length,
            totalEnrollments: enrollments.length,
            totalStudents: uniqueStudents.size,
            averageCompletion,
            courseStats,
        };
    }

    static async getStudentAnalytics(courseId: string) {
        return await Progress.find({ course: courseId })
            .populate("user", "name email")
            .sort({ progressPercent: -1 });
    }
}
