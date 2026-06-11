import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "../styles/SelectField.module.css";

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={styles.field} ref={fieldRef}>
      <span className={styles.label}>{label}</span>
      <div className={styles.selectWrap}>
        <button
          className={styles.selectButton}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        >
          <span>{value}</span>
          <span className={styles.chevron} aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </button>

        {open ? (
          <div className={styles.dropdown} id={listboxId} role="listbox" aria-label={label}>
            {options.map((option) => {
              const selected = option === value;

              return (
                <button
                  className={`${styles.option} ${selected ? styles.selectedOption : ""}`}
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(option)}
                >
                  <span>{option}</span>
                  {selected ? <Check size={16} /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
