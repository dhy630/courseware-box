import { useMemo, useState } from "react";
import {
  ArrowDown01,
  ArrowUp01,
  BookOpen,
  CalendarDays,
  ClipboardList,
  HeartHandshake,
  Search,
} from "lucide-react";
import { BranchModal } from "./components/BranchModal";
import { CascaderField } from "./components/CascaderField";
import { CourseCard } from "./components/CourseCard";
import { CourseScopeField } from "./components/CourseScopeField";
import { CoursewareCard } from "./components/CoursewareCard";
import { EmptyState } from "./components/EmptyState";
import { Header } from "./components/Header";
import { SelectField } from "./components/SelectField";
import {
  branches,
  coursewareList,
  defaultCourseFilters,
  defaultEntranceFilters,
  defaultPublicWelfareFilters,
  entranceCoursewareList,
  PLAYER_ROUTE,
  publicWelfareCoursewareList,
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
  PublicWelfareFilters,
  TodayCourse,
} from "./types";
import styles from "./styles/App.module.css";

type ThemeMode = "light" | "dark";
type SortDirection = "asc" | "desc";

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

const normalizeKeyword = (keyword: string) => keyword.trim().toLowerCase();
const PAGE_SIZE = 10;
const gradeLabels = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一"];

function getPageItems<Item>(items: Item[], page: number) {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

const getCourseGrade = (courseName: string, fallbackGrade: string) =>
  gradeLabels.find((grade) => courseName.includes(grade)) ?? fallbackGrade;

const getCreatedTime = (item: { createdAt?: string }) =>
  item.createdAt ? Date.parse(item.createdAt) : 0;

const sortByCreatedAt = <Item extends { createdAt?: string }>(
  items: Item[],
  direction: SortDirection,
) =>
  [...items].sort((current, next) =>
    direction === "desc"
      ? getCreatedTime(next) - getCreatedTime(current)
      : getCreatedTime(current) - getCreatedTime(next),
  );

function App() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("today");
  const [activePracticeTab, setActivePracticeTab] = useState<PracticeTab>("course");
  const [currentBranch, setCurrentBranch] = useState<Branch>(branches[0]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [courseFilters, setCourseFilters] = useState<CourseFilters>(defaultCourseFilters);
  const [publicWelfareFilters, setPublicWelfareFilters] = useState<PublicWelfareFilters>(
    defaultPublicWelfareFilters,
  );
  const [entranceFilters, setEntranceFilters] = useState<EntranceFilters>(defaultEntranceFilters);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

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
    <div className={styles.appShell} data-theme={themeMode}>
      <Header
        activeTab={activeMainTab}
        currentBranch={currentBranch.name}
        themeMode={themeMode}
        onTabChange={setActiveMainTab}
        onThemeToggle={() => setThemeMode((mode) => (mode === "light" ? "dark" : "light"))}
        onSwitchBranch={() => setIsBranchModalOpen(true)}
      />

      <main className={styles.main}>
        {activeMainTab === "today" ? (
          <TodayCoursesPage courses={todayCourses} onStartCourse={handleStartCourse} />
        ) : (
          <PracticeCenterPage
            activeTab={activePracticeTab}
            courseFilters={courseFilters}
            publicWelfareFilters={publicWelfareFilters}
            entranceFilters={entranceFilters}
            onCourseFiltersChange={setCourseFilters}
            onPublicWelfareFiltersChange={setPublicWelfareFilters}
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
        <div className={styles.todayGridWrapper}>
          <div className={styles.todayGrid}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onStartCourse={onStartCourse} />
            ))}
          </div>
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
  publicWelfareFilters: PublicWelfareFilters;
  entranceFilters: EntranceFilters;
  onTabChange: (tab: PracticeTab) => void;
  onCourseFiltersChange: (filters: CourseFilters) => void;
  onPublicWelfareFiltersChange: (filters: PublicWelfareFilters) => void;
  onEntranceFiltersChange: (filters: EntranceFilters) => void;
}

function PracticeCenterPage({
  activeTab,
  courseFilters,
  publicWelfareFilters,
  entranceFilters,
  onTabChange,
  onCourseFiltersChange,
  onPublicWelfareFiltersChange,
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
          <span>长短期课课件</span>
        </button>
        <button
          className={`${styles.practiceTab} ${activeTab === "publicWelfare" ? styles.activePracticeTab : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "publicWelfare"}
          onClick={() => onTabChange("publicWelfare")}
        >
          <HeartHandshake size={22} />
          <span>公益课课件</span>
        </button>
        <button
          className={`${styles.practiceTab} ${activeTab === "entrance" ? styles.activePracticeTab : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "entrance"}
          onClick={() => onTabChange("entrance")}
        >
          <ClipboardList size={22} />
          <span>森林探秘课件</span>
        </button>
      </div>

      <div className={styles.practiceContent}>
        {activeTab === "course" ? (
          <CoursePracticeTab
            filters={courseFilters}
            onFiltersChange={onCourseFiltersChange}
          />
        ) : activeTab === "publicWelfare" ? (
          <PublicWelfarePracticeTab
            filters={publicWelfareFilters}
            onFiltersChange={onPublicWelfareFiltersChange}
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
  const [lessonSortDirection, setLessonSortDirection] = useState<SortDirection>("desc");
  const selectedCourse = filters.scope.courses[0] ?? "全部课程";
  const classEntryLabels = filters.scope.classTypes.length > 0 ? filters.scope.classTypes : ["进入练课"];
  const filteredCoursewareList = useMemo(() => {
    const keyword = normalizeKeyword(appliedKeyword);
    const matchesCourse = normalizeKeyword(selectedCourse).includes(keyword);

    return coursewareList
      .filter((item) => !keyword || matchesCourse || item.title.toLowerCase().includes(keyword))
      .map((item) => ({
        ...item,
        grade: getCourseGrade(selectedCourse, item.grade),
        courseName: selectedCourse,
      }));
  }, [appliedKeyword, selectedCourse]);
  const sortedCoursewareList = useMemo(() => {
    return [...filteredCoursewareList].sort((current, next) =>
      lessonSortDirection === "desc"
        ? next.lessonNo - current.lessonNo
        : current.lessonNo - next.lessonNo,
    );
  }, [filteredCoursewareList, lessonSortDirection]);
  const totalPages = Math.max(1, Math.ceil(sortedCoursewareList.length / PAGE_SIZE));
  const pageCoursewareList = useMemo(
    () => getPageItems(sortedCoursewareList, Math.min(page, totalPages)),
    [sortedCoursewareList, page, totalPages],
  );

  const handleFilter = <Key extends keyof CourseFilters>(key: Key, value: CourseFilters[Key]) => {
    onFiltersChange({ ...filters, [key]: value });
    setPage(1);
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

  const handleEnterPractice = (item: CoursewareItem, classType?: string) => {
    console.log("进入练课", { ...item, classType });
  };

  const handleToggleLessonSort = () => {
    setLessonSortDirection((direction) => (direction === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const isLessonSortDesc = lessonSortDirection === "desc";

  return (
    <>
      <div className={`${styles.filterBar} ${styles.courseFilterBar}`}>
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
        <CourseScopeField
          label="课程范围"
          year={filters.year}
          value={filters.scope}
          onChange={(value) => handleFilter("scope", value)}
        />
        <div className={styles.searchRow}>
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
                placeholder="搜索课件"
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
      </div>

      <div className={styles.listHeader}>
        <div className={styles.listTitleGroup}>
          <h2>课程课件列表</h2>
          <span>
            共找到 <strong>{sortedCoursewareList.length}</strong> 个课件
          </span>
        </div>
        <button
          className={styles.sortButton}
          type="button"
          onClick={handleToggleLessonSort}
          aria-label={`当前按讲次${isLessonSortDesc ? "倒序" : "正序"}排列，点击切换为${isLessonSortDesc ? "正序" : "倒序"}`}
        >
          {isLessonSortDesc ? <ArrowDown01 size={18} /> : <ArrowUp01 size={18} />}
          <span>讲次{isLessonSortDesc ? "倒序" : "正序"}</span>
        </button>
      </div>

      {sortedCoursewareList.length > 0 ? (
        <>
          <div className={`${styles.cardGrid} ${styles.courseCardGrid}`}>
            {pageCoursewareList.map((item) => (
              <CoursewareCard
                key={item.id}
                item={item}
                actionLabels={classEntryLabels}
                onAction={handleEnterPractice}
              />
            ))}
          </div>
          <Pagination
            currentPage={Math.min(page, totalPages)}
            pageSize={PAGE_SIZE}
            total={sortedCoursewareList.length}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState title="暂无符合条件的课程" description="请调整筛选条件后重试" />
      )}
    </>
  );
}

interface PublicWelfarePracticeTabProps {
  filters: PublicWelfareFilters;
  onFiltersChange: (filters: PublicWelfareFilters) => void;
}

function PublicWelfarePracticeTab({
  filters,
  onFiltersChange,
}: PublicWelfarePracticeTabProps) {
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [timeSortDirection, setTimeSortDirection] = useState<SortDirection>("desc");
  const filteredPublicWelfareList = useMemo(() => {
    const keyword = normalizeKeyword(appliedKeyword);

    if (!keyword) {
      return publicWelfareCoursewareList;
    }

    return publicWelfareCoursewareList.filter((item) => item.title.toLowerCase().includes(keyword));
  }, [appliedKeyword]);
  const sortedPublicWelfareList = useMemo(
    () => sortByCreatedAt(filteredPublicWelfareList, timeSortDirection),
    [filteredPublicWelfareList, timeSortDirection],
  );
  const totalPages = Math.max(1, Math.ceil(sortedPublicWelfareList.length / PAGE_SIZE));
  const pagePublicWelfareList = useMemo(
    () => getPageItems(sortedPublicWelfareList, Math.min(page, totalPages)),
    [sortedPublicWelfareList, page, totalPages],
  );

  const handleFilter = <Key extends keyof PublicWelfareFilters>(
    key: Key,
    value: PublicWelfareFilters[Key],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
    setPage(1);
  };

  const handleSearch = () => {
    console.log("公益课查询条件", filters);
    setAppliedKeyword(filters.keyword);
    setPage(1);
  };

  const handleReset = () => {
    onFiltersChange(defaultPublicWelfareFilters);
    setAppliedKeyword("");
    setPage(1);
  };

  const handleEnterPractice = (item: CoursewareItem) => {
    console.log("进入公益课练课", item);
  };

  const handleToggleTimeSort = () => {
    setTimeSortDirection((direction) => (direction === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const isTimeSortDesc = timeSortDirection === "desc";

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
        <div className={styles.searchRow}>
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
                placeholder="搜索课件"
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
      </div>

      <div className={styles.listHeader}>
        <div className={styles.listTitleGroup}>
          <h2>公益课课件列表</h2>
          <span>
            共找到 <strong>{sortedPublicWelfareList.length}</strong> 个课件
          </span>
        </div>
        <button
          className={styles.sortButton}
          type="button"
          onClick={handleToggleTimeSort}
          aria-label={`当前按创建时间${isTimeSortDesc ? "最新" : "最早"}排列，点击切换为${isTimeSortDesc ? "最早" : "最新"}`}
        >
          {isTimeSortDesc ? <ArrowDown01 size={18} /> : <ArrowUp01 size={18} />}
          <span>时间{isTimeSortDesc ? "最新" : "最早"}</span>
        </button>
      </div>

      {sortedPublicWelfareList.length > 0 ? (
        <>
          <div className={styles.cardGrid}>
            {pagePublicWelfareList.map((item) => (
              <CoursewareCard key={item.id} item={item} onAction={handleEnterPractice} />
            ))}
          </div>
          <Pagination
            currentPage={Math.min(page, totalPages)}
            pageSize={PAGE_SIZE}
            total={sortedPublicWelfareList.length}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState title="暂无符合条件的公益课" description="请调整筛选条件后重试" />
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
  const [timeSortDirection, setTimeSortDirection] = useState<SortDirection>("desc");
  const filteredEntranceCoursewareList = useMemo(() => {
    const keyword = normalizeKeyword(appliedKeyword);

    if (!keyword) {
      return entranceCoursewareList;
    }

    return entranceCoursewareList.filter((item) => item.title.toLowerCase().includes(keyword));
  }, [appliedKeyword]);
  const sortedEntranceCoursewareList = useMemo(
    () => sortByCreatedAt(filteredEntranceCoursewareList, timeSortDirection),
    [filteredEntranceCoursewareList, timeSortDirection],
  );
  const totalPages = Math.max(1, Math.ceil(sortedEntranceCoursewareList.length / PAGE_SIZE));
  const pageEntranceCoursewareList = useMemo(
    () => getPageItems(sortedEntranceCoursewareList, Math.min(page, totalPages)),
    [sortedEntranceCoursewareList, page, totalPages],
  );

  const handleFilter = <Key extends keyof EntranceFilters>(
    key: Key,
    value: EntranceFilters[Key],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
    setPage(1);
  };

  const handleSearch = () => {
    console.log("森林探秘查询条件", filters);
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

  const handleToggleTimeSort = () => {
    setTimeSortDirection((direction) => (direction === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const isTimeSortDesc = timeSortDirection === "desc";

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
        <div className={styles.searchRow}>
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
                placeholder="搜索课件"
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
      </div>

      <div className={styles.listHeader}>
        <div className={styles.listTitleGroup}>
          <h2>森林探秘课件列表</h2>
          <span>
            共找到 <strong>{sortedEntranceCoursewareList.length}</strong> 个课件
          </span>
        </div>
        <button
          className={styles.sortButton}
          type="button"
          onClick={handleToggleTimeSort}
          aria-label={`当前按创建时间${isTimeSortDesc ? "最新" : "最早"}排列，点击切换为${isTimeSortDesc ? "最早" : "最新"}`}
        >
          {isTimeSortDesc ? <ArrowDown01 size={18} /> : <ArrowUp01 size={18} />}
          <span>时间{isTimeSortDesc ? "最新" : "最早"}</span>
        </button>
      </div>

      {sortedEntranceCoursewareList.length > 0 ? (
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
            total={sortedEntranceCoursewareList.length}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState title="暂无符合条件的森林探秘课件" description="请调整筛选条件后重试" />
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
