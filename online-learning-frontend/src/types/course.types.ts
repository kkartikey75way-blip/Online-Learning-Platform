export interface Lesson {
  _id: string;
  title: string;
  videoUrl?: string;
  isLocked?: boolean;
}

export interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}
