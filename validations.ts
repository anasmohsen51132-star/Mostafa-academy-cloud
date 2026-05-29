// src/lib/validations.ts
import { z } from "zod";

// ---- Auth ----
export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(60),
  phone: z
    .string()
    .min(10, "رقم الهاتف غير صحيح")
    .max(15, "رقم الهاتف غير صحيح")
    .regex(/^[0-9+\-\s]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل").max(100),
});

export const loginSchema = z.object({
  phone: z.string().min(1, "أدخل رقم الهاتف"),
  password: z.string().min(1, "أدخل كلمة المرور"),
});

// ---- Courses ----
export const courseSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل").max(120),
  description: z.string().max(1000).optional(),
  icon: z.string().max(10).default("📚"),
  color: z.string().max(20).default("#1A6B47"),
  isPublished: z.boolean().default(false),
});

// ---- Lectures ----
export const lectureSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  courseIds: z.array(z.string()).min(1, "يجب اختيار كورس واحد على الأقل"),
  order: z.number().int().default(0),
});

// ---- Videos ----
export const videoSchema = z.object({
  title: z.string().min(2).max(120),
  youtubeUrl: z.string().url("رابط يوتيوب غير صحيح"),
  duration: z.string().optional(),
  order: z.number().int().default(0),
});

// ---- Quiz ----
export const choiceSchema = z.object({
  text: z.string().optional(),
  imageUrl: z.string().optional(),
  isCorrect: z.boolean(),
  order: z.number().int().default(0),
});

export const questionSchema = z.object({
  text: z.string().optional(),
  imageUrl: z.string().optional(),
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"]).default("MULTIPLE_CHOICE"),
  order: z.number().int().default(0),
  choices: z.array(choiceSchema).min(2, "يجب إضافة خيارين على الأقل"),
});

export const quizSchema = z.object({
  title: z.string().min(3).max(120),
  timeLimit: z.number().int().positive().optional().nullable(),
  questions: z.array(questionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});

// ---- Homework ----
export const homeworkSchema = z.object({
  title: z.string().min(3).max(120),
  questions: z.array(questionSchema).min(1),
});

// ---- Access Codes ----
export const codeGenerateSchema = z.object({
  courseIds: z.array(z.string()).min(1, "يجب اختيار كورس واحد على الأقل"),
  count: z.number().int().min(1).max(500),
  expiresAt: z.string().optional().nullable(),
  note: z.string().max(200).optional(),
});

export const redeemSchema = z.object({
  code: z.string().min(6, "الكود يجب أن يكون 6 أحرف على الأقل"),
});

// ---- Site Settings ----
export const siteSettingsSchema = z.object({
  heroTitle: z.string().max(100).optional(),
  heroSubtitle: z.string().max(150).optional(),
  heroDesc: z.string().max(500).optional(),
  teacherName: z.string().max(80).optional(),
  teacherTitle: z.string().max(120).optional(),
  teacherBio: z.string().max(800).optional(),
  platformName: z.string().max(80).optional(),
  platformTagline: z.string().max(120).optional(),
  primaryColor: z.string().max(20).optional(),
  accentColor: z.string().max(20).optional(),
  dashboardWelcome: z.string().max(200).optional(),
  footerText: z.string().max(200).optional(),
}).passthrough();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type LectureInput = z.infer<typeof lectureSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type QuizInput = z.infer<typeof quizSchema>;
export type HomeworkInput = z.infer<typeof homeworkSchema>;
export type CodeGenerateInput = z.infer<typeof codeGenerateSchema>;
