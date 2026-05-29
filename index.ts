// ============================================================
// MUSTAFA ACADEMY — Global TypeScript Types
// ============================================================

export type Role = "OWNER" | "ADMIN" | "STUDENT";

// ---- USERS ----
export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  avatar?: string | null;
  joinedAt: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ---- COURSES ----
export interface Course {
  id: string;
  title: string;
  description?: string | null;
  icon: string;
  color: string;
  isPublished: boolean;
  createdAt: string;
  _count?: { lectures: number };
}

export interface CourseWithLectures extends Course {
  lectures: CourseLecture[];
}

// ---- LECTURES ----
export interface Lecture {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  createdAt: string;
  videos?: Video[];
  pdfs?: PDF[];
  quizzes?: Quiz[];
  homework?: Homework[];
  _count?: {
    videos: number;
    pdfs: number;
    quizzes: number;
    homework: number;
  };
}

export interface CourseLecture {
  id: string;
  lectureId: string;
  courseId: string;
  order: number;
  lecture: Lecture;
}

// ---- VIDEOS ----
export interface Video {
  id: string;
  lectureId: string;
  title: string;
  youtubeId: string; // encrypted/obfuscated
  order: number;
  duration?: string | null;
  createdAt: string;
}

// ---- PDFs ----
export interface PDF {
  id: string;
  lectureId: string;
  title: string;
  fileUrl: string;
  order: number;
  createdAt: string;
}

// ---- QUIZZES ----
export interface Quiz {
  id: string;
  lectureId: string;
  title: string;
  timeLimit?: number | null; // minutes
  questions: Question[];
  _count?: { questions: number };
}

export interface Question {
  id: string;
  quizId?: string | null;
  homeworkId?: string | null;
  text?: string | null;
  imageUrl?: string | null;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  order: number;
  choices: Choice[];
}

export interface Choice {
  id: string;
  questionId: string;
  text?: string | null;
  imageUrl?: string | null;
  isCorrect: boolean;
  order: number;
}

// ---- HOMEWORK ----
export interface Homework {
  id: string;
  lectureId: string;
  title: string;
  questions: Question[];
  _count?: { questions: number };
}

// ---- ACCESS CODES ----
export interface AccessCode {
  id: string;
  code: string;
  courseIds: string[];
  courses?: Course[];
  expiresAt?: string | null;
  usedBy?: string | null;
  usedAt?: string | null;
  usedByUser?: User | null;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  note?: string | null;
}

export interface RedeemResult {
  success: boolean;
  courses?: Course[];
  error?: string;
}

// ---- PROGRESS ----
export interface Progress {
  id: string;
  userId: string;
  lectureId: string;
  videoId?: string | null;
  quizId?: string | null;
  completed: boolean;
  score?: number | null;
  submittedAt?: string | null;
}

export interface StudentProgress {
  lectureId: string;
  completedVideos: string[];
  quizScores: Record<string, number>;
  homeworkDone: string[];
}

// ---- SITE SETTINGS ----
export interface SiteSettings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  teacherName: string;
  teacherTitle: string;
  teacherBio: string;
  teacherStats: { value: string; label: string }[];
  features: { icon: string; title: string; desc: string }[];
  primaryColor: string;
  accentColor: string;
  platformName: string;
  platformTagline: string;
  loginBgGradient: string;
  dashboardBanner?: string | null;
  dashboardWelcome: string;
  footerText: string;
  statsBar: { value: string; label: string }[];
}

// ---- API RESPONSES ----
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---- FORMS ----
export interface LoginForm {
  phone: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  phone: string;
  password: string;
}

export interface CourseForm {
  title: string;
  description: string;
  icon: string;
  color: string;
  isPublished: boolean;
}

export interface LectureForm {
  title: string;
  description: string;
  courseIds: string[];
}

export interface VideoForm {
  title: string;
  youtubeUrl: string;
  duration?: string;
}

export interface QuizForm {
  title: string;
  timeLimit?: number;
  questions: QuestionForm[];
}

export interface QuestionForm {
  text?: string;
  imageUrl?: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  choices: { text?: string; imageUrl?: string; isCorrect: boolean }[];
}

export interface CodeGenerateForm {
  courseIds: string[];
  count: number;
  expiresAt?: string;
  note?: string;
}

// ---- QUIZ SUBMISSION ----
export interface QuizSubmission {
  quizId: string;
  answers: Record<string, string>; // questionId -> choiceId
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  details: {
    questionId: string;
    correct: boolean;
    selectedChoiceId: string;
    correctChoiceId: string;
  }[];
}

// ---- STATS ----
export interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalLectures: number;
  totalCodes: number;
  codesUsed: number;
  activeStudents: number;
}
