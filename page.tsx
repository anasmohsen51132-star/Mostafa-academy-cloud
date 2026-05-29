// src/app/page.tsx
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TeacherSection } from "@/components/landing/TeacherSection";
import { CTASection } from "@/components/landing/CTASection";
import { ToastContainer } from "@/components/ui/Toast";
import prisma from "@/lib/prisma";

async function getSettings() {
  try {
    return await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton" },
      update: {},
    });
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const settings = await getSettings();

  return (
    <>
      <ToastContainer />
      <main style={{ direction: "rtl" }}>
        <HeroSection settings={settings} />
        <FeaturesSection settings={settings} />
        <TeacherSection settings={settings} />
        <CTASection />
        {/* Footer */}
        <footer className="bg-emerald-dark py-8 text-center">
          <p
            className="text-gold/60 text-sm font-amiri"
            style={{ fontFamily: "Amiri, serif" }}
          >
            {settings?.footerText ?? "© ٢٠٢٤ اكاديمية مستر مصطفى — جميع الحقوق محفوظة"}
          </p>
        </footer>
      </main>
    </>
  );
}
