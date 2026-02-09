export interface Lesson {
  _id: string;
  title: string;
  videoUrl?: string;
  content?: string;
  isLocked?: boolean;
}

export interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  _id: string;
  name: string;
  email: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructor: Instructor;
  price: number;
  capacity: number;
  dripEnabled: boolean;
  isPublished: boolean;
  enrolledCount: number;
}
