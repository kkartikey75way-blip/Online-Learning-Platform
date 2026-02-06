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
