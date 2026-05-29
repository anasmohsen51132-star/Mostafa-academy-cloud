// src/app/api/quizzes/[id]/submit/route.ts
import { NextRequest } from "next/server";
import { extractToken, verifyToken } from "@/lib/auth";
import { success, error, unauthorized } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = await params;
  const token = extractToken(req);
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return unauthorized();

  try {
    const { answers } = await req.json();
    // answers: Record<questionId, choiceId>

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { choices: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) return error("الاختبار غير موجود", 404);

    let correct = 0;
    const details: {
      questionId: string;
      correct: boolean;
      selectedChoiceId: string;
      correctChoiceId: string;
    }[] = [];

    for (const question of quiz.questions) {
      const selectedId = answers[question.id];
      const correctChoice = question.choices.find((c) => c.isCorrect);
      const isCorrect = selectedId === correctChoice?.id;
      if (isCorrect) correct++;
      details.push({
        questionId: question.id,
        correct: isCorrect,
        selectedChoiceId: selectedId || "",
        correctChoiceId: correctChoice?.id || "",
      });
    }

    const total = quiz.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = percentage >= 60;

    // Upsert submission (allow retake but store best or latest)
    await prisma.quizSubmission.upsert({
      where: { userId_quizId: { userId: payload.sub, quizId } },
      create: {
        userId: payload.sub,
        quizId,
        score: correct,
        total,
        percentage,
        passed,
        answers,
      },
      update: { score: correct, total, percentage, passed, answers, submittedAt: new Date() },
    });

    return success({ score: correct, total, percentage, passed, details });
  } catch (e) {
    console.error("[quiz submit]", e);
    return error("حدث خطأ في التسليم", 500);
  }
}
