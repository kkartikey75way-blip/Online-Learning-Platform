export interface Question {
    question: string;
    options: string[];
    correctAnswer?: string;
}

export interface Quiz {
    _id: string;
    lesson: string;
    questions: Question[];
    passingScore?: number;
}

export interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    content: string;
    createdAt: string;
}
