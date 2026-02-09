export interface CourseStat {
    id: string;
    title: string;
    enrolled: number;
    capacity: number;
    completion: number;
    isPublished: boolean;
}

export interface InstructorStats {
    totalCourses: number;
    totalEnrollments: number;
    totalStudents: number;
    averageCompletion: number;
    courseStats: CourseStat[];
}

export interface StudentAnalytic {
    _id: string;
    user?: {
        name: string;
        email: string;
    };
    progressPercent: number;
}

export interface Conversation {
    studentId: string;
    lastMessage?: {
        sender?: {
            name: string;
        };
        content: string;
    };
}
