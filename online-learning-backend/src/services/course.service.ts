import { Course } from "../models/course.model";
import { Module } from "../models/module.model";
import { Lesson } from "../models/lesson.model";
import { Assignment } from "../models/assignment.model";
import { Quiz } from "../models/quiz.model";
import { Question } from "../models/question.model";
import { Submission } from "../models/submission.model";
import { Enrollment } from "../models/enrollment.model";
import { Progress } from "../models/progress.model";
import { Certificate } from "../models/certificate.model";

export class CourseService {
    static async deleteCourseCascade(courseId: string) {
        const modules = await Module.find({ course: courseId });
        const moduleIds = modules.map((m) => m._id);

        const lessons = moduleIds.length
            ? await Lesson.find({ module: { $in: moduleIds } })
            : [];
        const lessonIds = lessons.map((l) => l._id);

        const assignments = lessonIds.length
            ? await Assignment.find({ lesson: { $in: lessonIds } })
            : [];
        const assignmentIds = assignments.map((a) => a._id);

        const quizzes = lessonIds.length
            ? await Quiz.find({ lesson: { $in: lessonIds } })
            : [];
        const quizIds = quizzes.map((q) => q._id);

        if (assignmentIds.length) {
            await Submission.deleteMany({ assignment: { $in: assignmentIds } });
        }

        if (quizIds.length) {
            await Question.deleteMany({ quiz: { $in: quizIds } });
        }

        await Assignment.deleteMany({ _id: { $in: assignmentIds } });
        await Quiz.deleteMany({ _id: { $in: quizIds } });
        await Lesson.deleteMany({ _id: { $in: lessonIds } });
        await Module.deleteMany({ _id: { $in: moduleIds } });
        await Enrollment.deleteMany({ course: courseId });
        await Progress.deleteMany({ course: courseId });
        await Certificate.deleteMany({ course: courseId });

        await Course.findByIdAndDelete(courseId);
    }

    static async enrollUser(userId: string, courseId: string) {
        const course = await Course.findById(courseId);
        if (!course || !course.isPublished) {
            throw new Error("Course not available");
        }

        if (course.enrolledCount >= course.capacity) {
            throw new Error("Course is full");
        }

        const alreadyEnrolled = await Enrollment.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyEnrolled) {
            throw new Error("Already enrolled");
        }

        await Enrollment.create({ user: userId, course: courseId });

        await Progress.findOneAndUpdate(
            { user: userId, course: courseId },
            {
                $setOnInsert: {
                    completedLessons: [],
                    progressPercent: 0,
                    completed: false,
                },
            },
            { upsert: true, new: true }
        );

        await Course.updateOne({ _id: courseId }, { $inc: { enrolledCount: 1 } });
    }
}
