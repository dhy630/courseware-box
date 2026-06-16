import { BookOpen, CalendarDays, GraduationCap } from "lucide-react";
import type { CoursewareItem, EntranceCoursewareItem } from "../types";
import styles from "../styles/CoursewareCard.module.css";

type CoursewareCardProps =
  | {
      item: CoursewareItem;
      mode?: "course";
      actionLabels?: string[];
      onAction: (item: CoursewareItem, actionLabel?: string) => void;
    }
  | {
      item: EntranceCoursewareItem;
      mode: "entrance";
      onAction: (item: EntranceCoursewareItem) => void;
    };

export function CoursewareCard(props: CoursewareCardProps) {
  const { item } = props;
  const isEntrance = props.mode === "entrance";
  const actionLabels = "actionLabels" in props ? props.actionLabels : undefined;
  const isCourseWithClassEntrances =
    !isEntrance && Boolean(actionLabels?.length);
  const hasSingleAction = isEntrance || !actionLabels?.length;

  return (
    <article className={`${styles.card} ${hasSingleAction ? styles.singleActionCard : ""}`}>
      <div className={styles.content}>
        <span className={styles.tag}>
          {isEntrance ? (
            <>
              <GraduationCap size={16} />
              森林探秘
            </>
          ) : (
            <>第 {(item as CoursewareItem).lessonNo} 讲</>
          )}
        </span>
        <h3>{item.title}</h3>
        <div className={styles.meta}>
          <span>
            <CalendarDays size={16} />
            {item.year}
          </span>
          {isCourseWithClassEntrances ? null : (
            <>
              <i />
              <span>{item.grade}</span>
            </>
          )}
          <i />
          <span>{isEntrance ? (item as EntranceCoursewareItem).subject : (item as CoursewareItem).courseName}</span>
        </div>
      </div>
      <div className={styles.cardWatermark} aria-hidden="true">
        <BookOpen size={112} />
      </div>
      {hasSingleAction ? (
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
      ) : (
        <div className={styles.actionGroup} aria-label="选择班型课件入口">
          {actionLabels.map((label) => (
            <button
              className={styles.action}
              type="button"
              key={label}
              onClick={() => props.onAction(item as CoursewareItem, label)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
