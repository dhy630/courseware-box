import { SearchX } from "lucide-react";
import styles from "../styles/EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <SearchX size={42} />
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}
