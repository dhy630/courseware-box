import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Search,
} from "lucide-react";
import { BranchModal } from "./components/BranchModal";
import { CascaderField } from "./components/CascaderField";
import { CourseCard } from "./components/CourseCard";
import { CoursewareCard } from "./components/CoursewareCard";
import { EmptyState } from "./components/EmptyState";
import { Header } from "./components/Header";
import { SelectField } from "./components/SelectField";
import {
  branches,
  coursewareList,
  defaultCourseFilters,
  defaultEntranceFilters,
  entranceCoursewareList,
  PLAYER_ROUTE,
  todayCourses,
} from "./mock/data";
import type {
  Branch,
  CourseFilters,
  CoursewareItem,
  EntranceCoursewareItem,
  EntranceFilters,
  MainTab,
  PracticeTab,
  TodayCourse,
} from "./types";
import styles from "./styles/App.module.css";

const subjectGradeOptions = [
  {
    label: "信息学算法",
    children: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一"],
  },
  {
    label: "信息学语言传播",
    children: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一"],
  },
  {
    label: "国文素养",
    children: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一"],
  },
  {
    label: "信息学实验P",
    children: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一"],
  },
  {
    label: "信息学实验C",
    children: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一"],
  },
];

const courseTypeCourseOptions = [
  { label: "长期课", children: ["春季课", "暑假课", "秋季课", "寒假课"] },
  { label: "短期课", children: ["短期课", "春季短期课", "暑假短期课", "秋季短期课", "寒假短期课"] },
  { label: "公益课", children: [] },
];

const normalizeKeyword = (keyword: string) => keyword.trim().toLowerCase();
const PAGE_SIZE = 10;

function getPageItems<Item>(items: Item[], page: number) {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

function App() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("today");
  const [activePracticeTab, setActivePracticeTab] = useState<PracticeTab>("course");
  const [currentBranch, setCurrentBranch] = useState<Branch>(branches[0]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [courseFilters, setCourseFilters] = useState<CourseFilters>(defaultCourseFilters);
  const [entranceFilters, setEntranceFilters] = useState<EntranceFilters>(defaultEntranceFilters);

  const playerRoute = useMemo(() => PLAYER_ROUTE, []);

  const handleStartCourse = (course: TodayCourse) => {
    console.log("进入课件播放页", course);
    const nextPath = playerRoute.replace(":id", String(course.id));
    window.history.pushState({ course }, "", nextPath);
  };

  const handleBranchConfirm = (branch: Branch) => {
    setCurrentBranch(branch);
    console.log(branch);
  };

  return (
    <div className={styles.appShell}>
      <Header
        activeTab={activeMainTab}
        currentBranch={currentBranch.name}
        onTabChange={setActiveMainTab}
        onSwitchBranch={() => setIsBranchModalOpen(true)}
      />

      <main className={styles.main}>
        {activeMainTab === "today" ? (
          <TodayCoursesPage courses={todayCourses} onStartCourse={handleStartCourse} />
        ) : (
          <PracticeCenterPage
            activeTab={activePracticeTab}
            courseFilters={courseFilters}
            entranceFilters={entranceFilters}
            onCourseFiltersChange={setCourseFilters}
            onEntranceFiltersChange={setEntranceFilters}
            onTabChange={setActivePracticeTab}
          />
        )}
      </main>

      <BranchModal
        branches={branches}
        currentBranch={currentBranch}
        open={isBranchModalOpen}
        onCancel={() => setIsBranchModalOpen(false)}
        onConfirm={handleBranchConfirm}
      />
    </div>
  );
}

interface TodayCoursesPageProps {
  courses: TodayCourse[];
  onStartCourse: (course: TodayCourse) => void;
}

function TodayCoursesPage({ courses, onStartCourse }: TodayCoursesPageProps) {
  return (
    <section className={styles.todayPage} aria-labelledby="today-title">
      <div className={styles.pageHeader}>
        <h1 id="today-title">今日课程</h1>
        <button className={styles.datePicker} type="button" aria-label="选择日期">
          <CalendarDays size={20} />
          <span>6月8日 周一</span>
        </button>
      </div>

      {courses.length > 0 ? (
        <div className={styles.todayGrid}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onStartCourse={onStartCourse} />
          ))}
        </div>
      ) : (
        <EmptyState title="今日暂无课程" description="请切换日期查看其他课程安排" />
      )}

    </section>
  );
}

interface PracticeCenterPageProps {
  activeTab: PracticeTab;
  courseFilters: CourseFilters;
  entranceFilters: EntranceFilters;
  onTabChange: (tab: PracticeTab) => void;
  onCourseFiltersChange: (filters: CourseFilters) => void;
  onEntranceFiltersChange: (filters: EntranceFilters) => void;
}

function PracticeCenterPage({
  activeTab,
  courseFilters,
  entranceFilters,
  onTabChange,
  onCourseFiltersChange,
  onEntranceFiltersChange,
}: PracticeCenterPageProps) {
  return (
    <section className={styles.practicePanel} aria-labelledby="practice-title">
      <h1 id="practice-title" className={styles.visuallyHidden}>
        练课中心
      </h1>

      <div className={styles.practiceTabs} role="tablist" aria-label="练课中心分类">
        <button
          className={`${styles.practiceTab} ${activeTab === "course" ? styles.activePracticeTab : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "course"}
          onClick={() => onTabChange("course")}
        >
          <BookOpen size={22} />
          <span>课程课件</span>
        </button>
        <button
          className={`${styles.practiceTab} ${activeTab === "entrance" ? styles.activePracticeTab : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "entrance"}
          onClick={() => onTabChange("entrance")}
        >
          <ClipboardList size={22} />
          <span>入学测课件</span>
        </button>
      </div>

      <div className={styles.practiceContent}>
        {activeTab === "course" ? (
          <CoursePracticeTab
            filters={courseFilters}
            onFiltersChange={onCourseFiltersChange}
          />
        ) : (
          <EntrancePracticeTab
            filters={entranceFilters}
            onFiltersChange={onEntranceFiltersChange}
          />
        )}
      </div>
    </section>
  );
}

interface CoursePracticeTabProps {
  filters: CourseFilters;
  onFiltersChange: (filters: CourseFilters) => void;
}

function CoursePracticeTab({ filters, onFiltersChange }: CoursePracticeTabProps) {
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [page, setPage] = useState(1);
  const filteredCoursewareList = useMemo(() => {
    const keyword = normalizeKeyword(appliedKeyword);

    if (!keyword) {
      return coursewareList;
    }

    return coursewareList.filter((item) => item.title.toLowerCase().includes(keyword));
  }, [appliedKeyword]);
  const totalPages = Math.max(1, Math.ceil(filteredCoursewareList.length / PAGE_SIZE));
  const pageCoursewareList = useMemo(
    () => getPageItems(filteredCoursewareList, Math.min(page, totalPages)),
    [filteredCoursewareList, page, totalPages],
  );

  const handleFilter = <Key extends keyof CourseFilters>(key: Key, value: CourseFilters[Key]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    console.log("课程查询条件", filters);
    setAppliedKeyword(filters.keyword);
    setPage(1);
  };

  const handleReset = () => {
    onFiltersChange(defaultCourseFilters);
    setAppliedKeyword("");
    setPage(1);
  };

  const handleEnterPractice = (item: CoursewareItem) => {
    console.log("进入练课", item);
  };

  return (
    <>
      <div className={styles.filterBar}>
        <SelectField
          label="年份"
          value={filters.year}
          options={["2026", "2025"]}
          onChange={(value) => handleFilter("year", value)}
        />
        <SelectField
          label="分校"
          value={filters.branch}
          options={["马鞍山分校", "合肥分校", "芜湖分校", "南京分校"]}
          onChange={(value) => handleFilter("branch", value)}
        />
        <CascaderField
          label="学科 / 年级"
          value={filters.subjectGrade}
          options={subjectGradeOptions}
          onChange={(value) => handleFilter("subjectGrade", value)}
        />
        <CascaderField
          label="课程类型 / 课程"
          value={filters.courseTypeCourse}
          options={courseTypeCourseOptions}
          onChange={(value) => handleFilter("courseTypeCourse", value)}
        />
        <SelectField
          label="班型"
          value={filters.classType}
          options={["全部", "小班", "精品班"]}
          onChange={(value) => handleFilter("classType", value)}
        />
        <label className={styles.searchField}>
          <span>课件名称搜索</span>
          <div className={styles.searchControl}>
            <button
              className={styles.searchButton}
              type="button"
              aria-label="搜索课件名称"
              onClick={handleSearch}
            >
              <Search size={20} />
            </button>
            <input
              type="search"
              value={filters.keyword}
              placeholder="搜索课件名称"
              onChange={(event) => handleFilter("keyword", event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
        </label>
        <button className={styles.primaryButton} type="button" onClick={handleSearch}>
          查询
        </button>
        <button className={styles.secondaryButton} type="button" onClick={handleReset}>
          重置
        </button>
      </div>

      <div className={styles.listHeader}>
        <div className={styles.listTitleGroup}>
          <h2>课程课件列表</h2>
          <span>
            共找到 <strong>{appliedKeyword ? filteredCoursewareList.length : coursewareList.length}</strong> 个课件
          </span>
        </div>
      </div>

      {filteredCoursewareList.length > 0 ? (
        <>
          <div className={styles.cardGrid}>
            {pageCoursewareList.map((item) => (
              <CoursewareCard key={item.id} item={item} onAction={handleEnterPractice} />
            ))}
          </div>
          <Pagination
            currentPage={Math.min(page, totalPages)}
            pageSize={PAGE_SIZE}
            total={filteredCoursewareList.length}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState title="暂无符合条件的课程" description="请调整筛选条件后重试" />
      )}
    </>
  );
}

interface EntrancePracticeTabProps {
  filters: EntranceFilters;
  onFiltersChange: (filters: EntranceFilters) => void;
}

function EntrancePracticeTab({ filters, onFiltersChange }: EntrancePracticeTabProps) {
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [page, setPage] = useState(1);
  const filteredEntranceCoursewareList = useMemo(() => {
    const keyword = normalizeKeyword(appliedKeyword);

    if (!keyword) {
      return entranceCoursewareList;
    }

    return entranceCoursewareList.filter((item) => item.title.toLowerCase().includes(keyword));
  }, [appliedKeyword]);
  const totalPages = Math.max(1, Math.ceil(filteredEntranceCoursewareList.length / PAGE_SIZE));
  const pageEntranceCoursewareList = useMemo(
    () => getPageItems(filteredEntranceCoursewareList, Math.min(page, totalPages)),
    [filteredEntranceCoursewareList, page, totalPages],
  );

  const handleFilter = <Key extends keyof EntranceFilters>(
    key: Key,
    value: EntranceFilters[Key],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    console.log("入学测查询条件", filters);
    setAppliedKeyword(filters.keyword);
    setPage(1);
  };

  const handleReset = () => {
    onFiltersChange(defaultEntranceFilters);
    setAppliedKeyword("");
    setPage(1);
  };

  const handleEnterCourseware = (item: EntranceCoursewareItem) => {
    console.log("进入课件", item);
  };

  return (
    <>
      <div className={`${styles.filterBar} ${styles.entranceFilterBar}`}>
        <SelectField
          label="年份"
          value={filters.year}
          options={["2026", "2025"]}
          onChange={(value) => handleFilter("year", value)}
        />
        <SelectField
          label="分校"
          value={filters.branch}
          options={["马鞍山分校", "合肥分校", "芜湖分校", "南京分校"]}
          onChange={(value) => handleFilter("branch", value)}
        />
        <CascaderField
          label="学科 / 年级"
          value={filters.subjectGrade}
          options={subjectGradeOptions}
          onChange={(value) => handleFilter("subjectGrade", value)}
        />
        <label className={styles.searchField}>
          <span>名称搜索</span>
          <div className={styles.searchControl}>
            <button
              className={styles.searchButton}
              type="button"
              aria-label="搜索课件名称"
              onClick={handleSearch}
            >
              <Search size={20} />
            </button>
            <input
              type="search"
              value={filters.keyword}
              placeholder="搜索课件名称"
              onChange={(event) => handleFilter("keyword", event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
        </label>
        <button className={styles.primaryButton} type="button" onClick={handleSearch}>
          查询
        </button>
        <button className={styles.secondaryButton} type="button" onClick={handleReset}>
          重置
        </button>
      </div>

      <div className={styles.listHeader}>
        <div className={styles.listTitleGroup}>
          <h2>入学测课件列表</h2>
          <span>
            共找到 <strong>{appliedKeyword ? filteredEntranceCoursewareList.length : 6}</strong> 个课件
          </span>
        </div>
      </div>

      {filteredEntranceCoursewareList.length > 0 ? (
        <>
          <div className={styles.cardGrid}>
            {pageEntranceCoursewareList.map((item) => (
              <CoursewareCard
                key={item.id}
                item={item}
                mode="entrance"
                onAction={handleEnterCourseware}
              />
            ))}
          </div>
          <Pagination
            currentPage={Math.min(page, totalPages)}
            pageSize={PAGE_SIZE}
            total={filteredEntranceCoursewareList.length}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState title="暂无符合条件的入学测课件" description="请调整筛选条件后重试" />
      )}
    </>
  );
}

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label="课件分页">
      <span className={styles.paginationSummary}>
        每页 {pageSize} 条，共 {total} 条
      </span>
      <div className={styles.paginationControls}>
        <button
          className={styles.pageButton}
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          上一页
        </button>
        {pages.map((page) => (
          <button
            className={`${styles.pageNumber} ${page === currentPage ? styles.activePageNumber : ""}`}
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={styles.pageButton}
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          下一页
        </button>
      </div>
    </nav>
  );
}

export default App;
