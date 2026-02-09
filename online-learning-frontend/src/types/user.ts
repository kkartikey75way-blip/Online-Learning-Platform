export interface User {
    _id?: string;
    name?: string;
    email?: string;
    role?: "STUDENT" | "INSTRUCTOR";
    provider?: "LOCAL" | "GOOGLE";
    isVerified?: boolean;
    interests?: string[];
    createdAt?: string;
    updatedAt?: string;
}
