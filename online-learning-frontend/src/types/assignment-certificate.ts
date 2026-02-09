export interface Assignment {
    _id: string;
    module: string;
    course: string;
    title: string;
    description: string;
    createdAt?: string;
}

export interface Submission {
    _id: string;
    assignment: string;
    student: string;
    link: string;
    grade?: number;
    feedback?: string;
    submittedAt: string;
}

export interface Certificate {
    _id: string;
    user: string;
    course: {
        _id: string;
        title: string;
    };
    issuedAt: string;
    issueDate: string;
    certificateId: string;
}
