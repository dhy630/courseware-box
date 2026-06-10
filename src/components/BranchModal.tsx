import type { Branch } from "../types";
import styles from "../styles/BranchModal.module.css";

interface BranchModalProps {
  branches: Branch[];
  currentBranch: Branch;
  open: boolean;
  onCancel: () => void;
  onConfirm: (branch: Branch) => void;
}

export function BranchModal({
  branches,
  currentBranch,
  open,
  onCancel,
  onConfirm,
}: BranchModalProps) {
  if (!open) {
    return null;
  }

  const handleSelect = (branch: Branch) => {
    onConfirm(branch);
    onCancel();
  };

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onCancel}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="branch-modal-title">切换分校</h2>
        <div className={styles.branchGrid} role="list" aria-label="分校列表">
          {branches.map((branch) => {
            const isCurrent = branch.id === currentBranch.id;

            return (
              <button
                key={branch.id}
                className={`${styles.branchOption} ${isCurrent ? styles.currentBranch : ""}`}
                type="button"
                role="listitem"
                aria-current={isCurrent ? "true" : undefined}
                onClick={() => handleSelect(branch)}
              >
                <span className={styles.branchIcon}>{branch.name.slice(0, 1)}</span>
                <span className={styles.branchName}>
                  {branch.name}
                  {isCurrent ? <em>当前</em> : null}
                </span>
              </button>
            );
          })}
        </div>
        <footer className={styles.actions}>
          <button className={styles.cancelButton} type="button" onClick={onCancel}>
            取消
          </button>
        </footer>
      </section>
    </div>
  );
}
