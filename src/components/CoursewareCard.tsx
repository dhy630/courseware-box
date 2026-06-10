import { BookOpen, CalendarDays, GraduationCap } from "lucide-react";
import type { CoursewareItem, EntranceCoursewareItem } from "../types";
import styles from "../styles/CoursewareCard.module.css";

type CoursewareCardProps =
  | {
      item: CoursewareItem;
      mode?: "course";
      onAction: (item: CoursewareItem) => void;
    }
  | {
      item: EntranceCoursewareItem;
      mode: "entrance";
      onAction: (item: EntranceCoursewareItem) => void;
    };

export function CoursewareCard(props: CoursewareCardProps) {
  const { item } = props;
  const isEntrance = props.mode === "entrance";

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <span className={styles.tag}>
          {isEntrance ? (
            <>
              <GraduationCap size={16} />
              入学测
            </>
          ) : (
            <>第 {(item as CoursewareItem).lessonNo}讲</>
          )}
        </span>
        <h3>{item.title}</h3>
        <div className={styles.meta}>
          <span>
            <CalendarDays size={16} />
            {item.year}
          </span>
          <i />
          <span>{item.grade}</span>
          <i />
          <span>{isEntrance ? (item as EntranceCoursewareItem).subject : (item as CoursewareItem).courseName}</span>
        </div>
      </div>
      <div className={styles.cardWatermark} aria-hidden="true">
        <BookOpen size={112} />
      </div>
      <button
        className={styles.action}
        type="button"
        onClick={() => {
          if (isEntrance) {
            props.onAction(item as EntranceCoursewareItem);
          } else {
            props.onAction(item as CoursewareItem);
          }
        }}
      >
        {isEntrance ? "进入课件" : "进入练课"}
      </button>
    </article>
  );
}
