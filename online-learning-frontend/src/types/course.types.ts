export interface Lesson {
  _id: string;
  title: string;
  dripAfterDays: number;
  isLocked?: boolean;
}

export interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}
