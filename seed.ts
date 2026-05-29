// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create site settings singleton
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });

  // Create owner account
  const ownerPhone = process.env.OWNER_PHONE || "01000000000";
  const ownerPassword = process.env.OWNER_PASSWORD || "owner1234";
  const ownerName = process.env.OWNER_NAME || "مستر مصطفى";

  const existing = await prisma.user.findUnique({ where: { phone: ownerPhone } });
  if (!existing) {
    const hash = await bcrypt.hash(ownerPassword, 12);
    const owner = await prisma.user.create({
      data: {
        name: ownerName,
        phone: ownerPhone,
        passwordHash: hash,
        role: Role.OWNER,
        avatar: "م",
      },
    });
    console.log(`✅ Owner created: ${owner.phone}`);
  } else {
    console.log("ℹ️  Owner already exists");
  }

  // Create a demo course
  const course = await prisma.course.upsert({
    where: { id: "demo-course-1" },
    create: {
      id: "demo-course-1",
      title: "النحو والصرف للمبتدئين",
      description: "دورة شاملة في أساسيات النحو والصرف للمرحلة الابتدائية والإعدادية",
      icon: "📖",
      color: "#1A6B47",
      isPublished: true,
    },
    update: {},
  });
  console.log(`✅ Demo course: ${course.title}`);

  // Create a demo lecture
  const lecture = await prisma.lecture.upsert({
    where: { id: "demo-lecture-1" },
    create: {
      id: "demo-lecture-1",
      title: "المقدمة: ما هي اللغة العربية؟",
      description: "نظرة عامة على اللغة العربية وأهميتها",
      order: 1,
    },
    update: {},
  });

  // Link lecture to course
  await prisma.courseLecture.upsert({
    where: { courseId_lectureId: { courseId: course.id, lectureId: lecture.id } },
    create: { courseId: course.id, lectureId: lecture.id, order: 1 },
    update: {},
  });

  console.log(`✅ Demo lecture linked to course`);
  console.log("\n🎉 Seed complete!");
  console.log(`\n📋 Login credentials:`);
  console.log(`   Phone: ${ownerPhone}`);
  console.log(`   Password: ${ownerPassword}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
