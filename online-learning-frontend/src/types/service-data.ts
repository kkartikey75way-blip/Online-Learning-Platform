export interface CreateLessonData {
    title: string;
    module: string;
    videoUrl?: string;
    content?: string;
    order: number;
    dripUnlockDate?: Date;
}

export interface UpdateCourseData {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    capacity?: number;
    thumbnail?: string;
    isPublished?: boolean;
}
