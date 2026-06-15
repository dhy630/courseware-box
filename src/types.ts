export type MainTab = "today" | "practice";

export type PracticeTab = "course" | "publicWelfare" | "entrance";

export type CoursewareStatus = "LOCAL" | "HEFEI" | "NONE";

export type CourseStatus = "ENDED" | "AVAILABLE" | "DISABLED";

export interface Branch {
  id: number;
  name: string;
}

export interface TodayCourse {
  id: number;
  period: "上午" | "下午" | "晚上";
  startTime: string;
  endTime: string;
  courseType: string;
  courseName: string;
  lessonNo: number;
  lessonTitle: string;
  coursewareStatus: CoursewareStatus;
  courseStatus: CourseStatus;
}

export interface CoursewareItem {
  id: number;
  lessonNo: number;
  title: string;
  year: number;
  grade: string;
  courseName: string;
}

export interface EntranceCoursewareItem {
  id: number;
  title: string;
  year: number;
  grade: string;
  subject: string;
}

export interface CourseFilters {
  year: string;
  branch: string;
  subjectGrade: string;
  courseTypeCourse: string;
  classType: string;
  keyword: string;
}

export interface PublicWelfareFilters {
  year: string;
  branch: string;
  subjectGrade: string;
  keyword: string;
}

export interface EntranceFilters {
  year: string;
  branch: string;
  subjectGrade: string;
  keyword: string;
}
