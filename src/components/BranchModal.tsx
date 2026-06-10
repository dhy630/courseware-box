import { useEffect, useState } from "react";
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
  const [selectedBranchId, setSelectedBranchId] = useState(currentBranch.id);

  useEffect(() => {
    if (open) {
      setSelectedBranchId(currentBranch.id);
    }
  }, [currentBranch.id, open]);

  if (!open) {
    return null;
  }

  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) ?? currentBranch;

  const handleConfirm = () => {
    onConfirm(selectedBranch);
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
        <label className={styles.field}>
          <span>分校</span>
          <select
            value={selectedBranchId}
            onChange={(event) => setSelectedBranchId(Number(event.target.value))}
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
        <footer className={styles.actions}>
          <button className={styles.cancelButton} type="button" onClick={onCancel}>
            取消
          </button>
          <button className={styles.confirmButton} type="button" onClick={handleConfirm}>
            确认切换
          </button>
        </footer>
      </section>
    </div>
  );
}
