export interface Lesson {
    _id: string;
    title: string;
    content: string;
    videoUrl?: string;
    module: string;
}

export interface Assignment {
    _id: string;
    title: string;
    description: string;
    module: string;
    course: string;
}

export interface Student {
    _id: string;
    name: string;
    email: string;
}

export interface Submission {
    _id: string;
    student: Student;
    assignment: string;
    link: string;
    grade?: number;
    feedback?: string;
}

export interface Module {
    _id: string;
    title: string;
    course: string;
}
