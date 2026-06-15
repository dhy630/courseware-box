import {
  AlertCircle,
  BookOpen,
  Clock3,
  Info,
  Moon,
  Sun,
} from "lucide-react";
import type { TodayCourse } from "../types";
import styles from "../styles/CourseCard.module.css";

interface CourseCardProps {
  course: TodayCourse;
  onStartCourse: (course: TodayCourse) => void;
}

export function CourseCard({ course, onStartCourse }: CourseCardProps) {
  const isAvailable = course.courseStatus === "AVAILABLE";
  const isEnded = course.courseStatus === "ENDED";
  const canEnterCourseware = isAvailable || isEnded;
  const periodClass = styles[`period${course.period}`];
  const PeriodIcon = course.period === "晚上" ? Moon : Sun;
  const displayCourseName = `${course.courseType.replace(/课$/, "")}·${course.courseName.replace(/\s*·\s*/, "·")}`;

  return (
    <article className={`${styles.card} ${periodClass}`}>
      <div className={styles.cardAccent} aria-hidden="true" />
      <div className={styles.cardTop}>
        <span className={styles.scheduleMark}>
          <PeriodIcon size={17} />
        </span>
        <div className={styles.scheduleText}>
          <span>{course.period}</span>
          <strong>
            <Clock3 size={16} />
            {course.startTime} - {course.endTime}
          </strong>
        </div>
      </div>

      <div className={styles.titleBlock}>
        <h2 className={styles.courseTitle}>{displayCourseName}</h2>
        <div className={styles.lessonRow}>
          <BookOpen size={22} />
          <strong>第 {course.lessonNo} 讲</strong>
          <span className={styles.separator} />
          <span className={styles.lessonTitle}>{course.lessonTitle}</span>
        </div>
      </div>

      <div className={styles.messageArea}>
        {course.coursewareStatus === "HEFEI" ? (
          <div className={styles.warningMessage}>
            <AlertCircle size={24} />
            <span>本分校未上传课件，将默认使用合肥课件</span>
          </div>
        ) : null}
        {course.coursewareStatus === "NONE" ? (
          <div className={styles.mutedMessage}>
            <Info size={22} />
            <span>该课程课件暂未上传，请联系教研</span>
          </div>
        ) : null}
      </div>

      <button
        className={`${styles.actionButton} ${
          isAvailable ? styles.startButton : isEnded ? styles.endedButton : styles.disabledButton
        }`}
        type="button"
        disabled={!canEnterCourseware}
        onClick={() => onStartCourse(course)}
      >
        {isAvailable ? "开始上课" : isEnded ? "进入课件" : "暂无课件"}
      </button>
    </article>
  );
}
