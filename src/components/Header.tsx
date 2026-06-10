import { ChevronDown, LogOut, MapPin, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MainTab } from "../types";
import styles from "../styles/Header.module.css";

interface HeaderProps {
  activeTab: MainTab;
  currentBranch: string;
  onTabChange: (tab: MainTab) => void;
  onSwitchBranch: () => void;
}

export function Header({ activeTab, currentBranch, onTabChange, onSwitchBranch }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  const handleSwitchBranch = () => {
    setMenuOpen(false);
    onSwitchBranch();
  };

  const handleLogout = () => {
    setMenuOpen(false);
    console.log("退出登录");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoGroup}>
        <div className={styles.logoMark} aria-hidden="true">
          F
        </div>
        <span>方田课件平台</span>
      </div>

      <nav className={styles.nav} aria-label="主导航">
        <button
          className={`${styles.navButton} ${activeTab === "today" ? styles.activeNav : ""}`}
          type="button"
          onClick={() => onTabChange("today")}
        >
          今日课程
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "practice" ? styles.activeNav : ""}`}
          type="button"
          onClick={() => onTabChange("practice")}
        >
          练课中心
        </button>
      </nav>

      <div className={styles.userArea} ref={menuRef}>
        <button
          className={styles.userButton}
          type="button"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.avatar}>
            <UserRound size={30} />
          </span>
          <span className={styles.userText}>
            <strong>王老师</strong>
            <span>{currentBranch}</span>
          </span>
          <ChevronDown size={22} />
        </button>

        {menuOpen ? (
          <div className={styles.userMenu} role="menu">
            <div className={styles.branchLine}>
              <MapPin size={16} />
              <span>当前分校：{currentBranch}</span>
            </div>
            <button type="button" role="menuitem" onClick={handleSwitchBranch}>
              <MapPin size={16} />
              切换分校
            </button>
            <button type="button" role="menuitem" onClick={handleLogout}>
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
