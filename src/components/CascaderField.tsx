import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "../styles/CascaderField.module.css";

export interface CascaderOption {
  label: string;
  children: string[];
}

interface CascaderFieldProps {
  label: string;
  value: string;
  options: CascaderOption[];
  onChange: (value: string) => void;
}

const joinValue = (parent: string, child: string) => `${parent} / ${child}`;

export function CascaderField({ label, value, options, onChange }: CascaderFieldProps) {
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const [selectedParent, selectedChild] = value.split(" / ");
  const activeParent = useMemo(
    () => options.find((option) => option.label === selectedParent)?.label ?? options[0]?.label,
    [options, selectedParent],
  );
  const [previewParent, setPreviewParent] = useState(activeParent);

  const previewChildren =
    options.find((option) => option.label === previewParent)?.children ?? options[0]?.children ?? [];

  useEffect(() => {
    if (open) {
      setPreviewParent(activeParent);
    }
  }, [activeParent, open]);

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

  const handleChildSelect = (child: string) => {
    onChange(joinValue(previewParent, child));
    setOpen(false);
  };

  return (
    <div className={styles.field} ref={fieldRef}>
      <span className={styles.label}>{label}</span>
      <div className={styles.controlWrap}>
        <button
          className={styles.trigger}
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
          <span className={styles.value}>
            <span>{selectedParent}</span>
            <span className={styles.divider} aria-hidden="true" />
            <span>{selectedChild}</span>
          </span>
          <span className={styles.chevron} aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </button>

        {open ? (
          <div className={styles.panel} id={listboxId} role="listbox" aria-label={label}>
            <div className={styles.parentColumn}>
              {options.map((option) => {
                const active = option.label === previewParent;

                return (
                  <button
                    className={`${styles.parentOption} ${active ? styles.activeParentOption : ""}`}
                    key={option.label}
                    type="button"
                    onClick={() => setPreviewParent(option.label)}
                  >
                    <span>{option.label}</span>
                    <ChevronDown size={14} />
                  </button>
                );
              })}
            </div>
            <div className={styles.childColumn}>
              {previewChildren.map((child) => {
                const selected = previewParent === selectedParent && child === selectedChild;

                return (
                  <button
                    className={`${styles.childOption} ${selected ? styles.selectedChildOption : ""}`}
                    key={child}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleChildSelect(child)}
                  >
                    <span>{child}</span>
                    {selected ? <Check size={16} /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
