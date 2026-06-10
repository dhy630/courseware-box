import { ChevronDown } from "lucide-react";
import styles from "../styles/SelectField.module.css";

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <div className={styles.selectWrap}>
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={18} />
      </div>
    </label>
  );
}
