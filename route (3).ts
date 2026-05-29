// src/app/api/courses/route.ts
import { NextRequest } from "next/server";
import { extractToken, verifyToken } from "@/lib/auth";
import { courseSchema } from "@/lib/validations";
import { success, error, unauthorized, forbidden } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = extractToken(req);
    const payload = token ? await verifyToken(token) : null;

    const isAdmin = payload && (payload.role === "ADMIN" || payload.role === "OWNER");

    const courses = await prisma.course.findMany({
      where: isAdmin ? {} : { isPublished: true },
      include: {
        _count: { select: { lectures: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // If student, check which are unlocked via codes
    let unlockedCourseIds: string[] = [];
    if (payload && payload.role === "STUDENT") {
      const codes = await prisma.accessCode.findMany({
        where: { usedById: payload.sub },
        include: { courses: { select: { courseId: true } } },
      });
      unlockedCourseIds = codes.flatMap((c) => c.courses.map((cc) => cc.courseId));
    }

    const result = courses.map((c) => ({
      ...c,
      unlocked: isAdmin ? true : unlockedCourseIds.includes(c.id),
    }));

    return success(result);
  } catch (e) {
    console.error("[courses GET]", e);
    return error("حدث خطأ", 500);
  }
}

export async function POST(req: NextRequest) {
  const token = extractToken(req);
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return unauthorized();
  if (payload.role !== "ADMIN" && payload.role !== "OWNER") return forbidden();

  try {
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors[0]?.message || "بيانات غير صحيحة");

    const course = await prisma.course.create({
      data: parsed.data,
      include: { _count: { select: { lectures: true } } },
    });
    return success(course);
  } catch (e) {
    console.error("[courses POST]", e);
    return error("حدث خطأ في الحفظ", 500);
  }
}
