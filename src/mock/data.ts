import type {
  Branch,
  CourseFilters,
  CoursewareItem,
  EntranceCoursewareItem,
  EntranceFilters,
  TodayCourse,
} from "../types";

export const PLAYER_ROUTE = "/courseware/player/:id";

export const branches: Branch[] = [
  { id: 1, name: "合肥分校" },
  { id: 2, name: "马鞍山分校" },
  { id: 3, name: "芜湖分校" },
  { id: 4, name: "南京分校" },
];

export const todayCourses: TodayCourse[] = [
  {
    id: 1,
    period: "上午",
    startTime: "08:30",
    endTime: "10:30",
    courseType: "暑假课",
    courseName: "五年级算法 · 小星星",
    lessonNo: 8,
    lessonTitle: "分数应用题综合",
    coursewareStatus: "LOCAL",
    courseStatus: "ENDED",
  },
  {
    id: 2,
    period: "下午",
    startTime: "14:00",
    endTime: "16:00",
    courseType: "暑假课",
    courseName: "五年级算法 · 小星星",
    lessonNo: 5,
    lessonTitle: "一元一次方程",
    coursewareStatus: "HEFEI",
    courseStatus: "AVAILABLE",
  },
  {
    id: 3,
    period: "晚上",
    startTime: "18:30",
    endTime: "20:30",
    courseType: "暑假课",
    courseName: "五年级算法 · 小星星",
    lessonNo: 3,
    lessonTitle: "函数基础",
    coursewareStatus: "NONE",
    courseStatus: "DISABLED",
  },
];

export const coursewareList: CoursewareItem[] = [
  {
    id: 1,
    lessonNo: 8,
    title: "分数应用题综合",
    year: 2026,
    grade: "五年级",
    courseName: "小星星",
  },
  {
    id: 2,
    lessonNo: 9,
    title: "行程问题基础",
    year: 2026,
    grade: "五年级",
    courseName: "小星星",
  },
  {
    id: 3,
    lessonNo: 7,
    title: "分数的意义和性质",
    year: 2026,
    grade: "五年级",
    courseName: "小星星",
  },
  {
    id: 4,
    lessonNo: 6,
    title: "分数的加减法",
    year: 2026,
    grade: "五年级",
    courseName: "小星星",
  },
];

export const entranceCoursewareList: EntranceCoursewareItem[] = [
  {
    id: 1,
    title: "2026年暑期五年级入学测课件（信息学算法）",
    year: 2026,
    grade: "五年级",
    subject: "信息学算法",
  },
  {
    id: 2,
    title: "2026年秋季五年级入学测课件（信息学算法）",
    year: 2026,
    grade: "五年级",
    subject: "信息学算法",
  },
  {
    id: 3,
    title: "2026年秋季五年级入学测课件（数学思维）",
    year: 2026,
    grade: "五年级",
    subject: "数学思维",
  },
  {
    id: 4,
    title: "2026年春季五年级入学测课件（信息学算法）",
    year: 2026,
    grade: "五年级",
    subject: "信息学算法",
  },
  {
    id: 5,
    title: "2025年秋季五年级入学测课件（信息学算法）",
    year: 2025,
    grade: "五年级",
    subject: "信息学算法",
  },
  {
    id: 6,
    title: "2025年春季五年级入学测课件（数学思维）",
    year: 2025,
    grade: "五年级",
    subject: "数学思维",
  },
];

export const defaultCourseFilters: CourseFilters = {
  year: "2026",
  branch: "马鞍山分校",
  subjectGrade: "信息学算法 / 初一",
  courseTypeCourse: "长期课 / 春季课",
  classType: "全部",
  keyword: "",
};

export const defaultEntranceFilters: EntranceFilters = {
  year: "2026",
  branch: "马鞍山分校",
  subjectGrade: "信息学算法 / 五年级",
  keyword: "",
};
