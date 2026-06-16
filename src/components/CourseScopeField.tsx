import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { CSSProperties } from "react";
import type { CourseScopeSelection } from "../types";
import styles from "../styles/CourseScopeField.module.css";

interface CourseScopeFieldProps {
  label: string;
  year: string;
  value: CourseScopeSelection;
  onChange: (value: CourseScopeSelection) => void;
}

const subjects = ["信息学算法", "数学", "英语", "国文素养", "信息学实验P", "信息学实验C"];
const courseTypes = [
  "长期课-春季课",
  "长期课-暑假课",
  "长期课-秋季课",
  "长期课-寒假课",
  "短期课",
  "短期课-春季课",
  "短期课-暑假课",
  "短期课-秋季课",
  "短期课-寒假课",
];
const grades = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一"];
const classTypes = ["小星星", "小月亮", "小太阳", "小太阳+", "创新"];

const getCourseSeason = (courseType: string) => {
  const season = courseType.split("-")[1] ?? courseType;

  if (courseType === "短期课") {
    return "短期课";
  }

  return courseType.startsWith("短期课") ? `${season.replace("课", "")}短期课` : season;
};

const buildCourses = (year: string, selection: CourseScopeSelection) => {
  const selectedGrades = selection.grades.length > 0 ? [selection.grades[0]] : [grades[0]];
  const season = getCourseSeason(selection.courseType);

  return selectedGrades.flatMap((grade) => {
    const base = `${year}${grade}${selection.subject}${season}`;

    return [base, `${base}【衔接班】`];
  });
};

const toggleValue = (items: string[], item: string) =>
  items.includes(item) ? items.filter((current) => current !== item) : [...items, item];

const trimSelected = (selected: string[], available: string[]) =>
  selected.filter((item) => available.includes(item));

export function CourseScopeField({ label, year, value, onChange }: CourseScopeFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const courseOptions = useMemo(() => buildCourses(year, draft), [draft, year]);

  const summary = useMemo(
    () =>
      [
        value.subject,
        value.courseType,
        value.grades[0] ?? "未选年级",
        value.courses[0] ?? "未选课程",
        value.classTypes.length > 0 ? `已选${value.classTypes.length}个班型` : "未选班型",
      ].join(" / "),
    [value],
  );

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePanelPosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const width = Math.min(1280, window.innerWidth - 48);
      const left = Math.min(Math.max(24, rect.left), window.innerWidth - width - 24);

      setPanelStyle({
        top: rect.bottom + 8,
        left,
        width,
      });
    };

    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);

    const handlePointerDown = (event: PointerEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  const updateDraft = (next: CourseScopeSelection) => {
    const availableCourses = buildCourses(year, next);
    const courses = trimSelected(next.courses.slice(0, 1), availableCourses);

    setDraft({ ...next, courses: courses.length > 0 ? courses : [availableCourses[0]] });
  };

  const handleSubjectSelect = (subject: string) => {
    updateDraft({ ...draft, subject });
  };

  const handleCourseTypeSelect = (courseType: string) => {
    updateDraft({ ...draft, courseType });
  };

  const handleGradeToggle = (grade: string) => {
    updateDraft({ ...draft, grades: [grade] });
  };

  const handleCourseToggle = (course: string) => {
    setDraft({ ...draft, courses: [course] });
  };

  const handleClassTypeToggle = (classType: string) => {
    setDraft({ ...draft, classTypes: toggleValue(draft.classTypes, classType) });
  };

  const handleClear = () => {
    setDraft({
      subject: subjects[0],
      courseType: courseTypes[0],
      grades: [grades[0]],
      courses: [buildCourses(year, { ...draft, subject: subjects[0], courseType: courseTypes[0], grades: [grades[0]] })[0]],
      classTypes: [],
    });
  };

  const handleConfirm = () => {
    onChange(draft);
    setOpen(false);
  };

  return (
    <div className={styles.field} ref={fieldRef}>
      <span className={styles.label}>{label}</span>
      <button
        className={styles.trigger}
        type="button"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        <span className={styles.value}>{summary}</span>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronDown size={16} />
        </span>
      </button>

      {open ? (
        <div className={styles.panel} id={panelId} role="dialog" aria-label={label} style={panelStyle}>
          <div className={styles.panelTitle}>课程范围</div>
          <div className={styles.columns}>
            <ChoiceColumn
              title="学科"
              options={subjects}
              selected={[draft.subject]}
              mode="radio"
              onSelect={handleSubjectSelect}
            />
            <ChoiceColumn
              title="课程类型"
              options={courseTypes}
              selected={[draft.courseType]}
              mode="radio"
              onSelect={handleCourseTypeSelect}
            />
            <ChoiceColumn
              title="年级"
              options={grades}
              selected={draft.grades}
              mode="radio"
              onSelect={handleGradeToggle}
            />
            <ChoiceColumn
              title="课程"
              options={courseOptions}
              selected={draft.courses}
              mode="radio"
              wide
              onSelect={handleCourseToggle}
            />
            <ChoiceColumn
              title="班型（多选）"
              options={classTypes}
              selected={draft.classTypes}
              mode="checkbox"
              onSelect={handleClassTypeToggle}
            />
          </div>
          <div className={styles.actions}>
            <button className={styles.clearButton} type="button" onClick={handleClear}>
              清空
            </button>
            <button className={styles.confirmButton} type="button" onClick={handleConfirm}>
              确定
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface ChoiceColumnProps {
  title: string;
  options: string[];
  selected: string[];
  mode: "radio" | "checkbox";
  wide?: boolean;
  onSelect: (option: string) => void;
}

function ChoiceColumn({ title, options, selected, mode, wide = false, onSelect }: ChoiceColumnProps) {
  return (
    <section className={`${styles.column} ${wide ? styles.wideColumn : ""}`}>
      <h3>{title}</h3>
      <div className={styles.optionList}>
        {options.map((option) => {
          const checked = selected.includes(option);

          return (
            <button
              className={styles.option}
              key={option}
              type="button"
              role={mode === "radio" ? "radio" : "checkbox"}
              aria-checked={checked}
              onClick={() => onSelect(option)}
            >
              <span className={mode === "radio" ? styles.radioMark : styles.checkMark} aria-hidden="true">
                {checked ? mode === "radio" ? <span /> : <Check size={15} /> : null}
              </span>
              <span className={styles.optionText}>{option}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
