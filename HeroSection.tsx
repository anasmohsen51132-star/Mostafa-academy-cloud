"use client";
// src/components/landing/HeroSection.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import type { SiteSettings } from "@/types";

interface Props {
  settings: Partial<SiteSettings> | null;
}

const STATS_DEFAULT = [
  { value: "٥٠٠٠+", label: "طالب مسجل" },
  { value: "٢٠", label: "دورة متاحة" },
  { value: "١٥+", label: "سنة خبرة" },
  { value: "٩٨٪", label: "نسبة الرضا" },
];

export function HeroSection({ settings }: Props) {
  const statsBar = (settings?.statsBar as typeof STATS_DEFAULT | undefined) ?? STATS_DEFAULT;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0D3D27 0%, #1A6B47 60%, #0D3D27 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Arabesque pattern overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-60 pointer-events-none" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-48 h-48 rounded-full opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2D9E6B, transparent)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Navbar */}
      <nav className="absolute top-0 inset-x-0 h-16 flex items-center px-6 z-20"
        style={{ background: "rgba(13,61,39,0.7)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="flex-1">
          <span className="font-amiri text-gold-light text-base font-bold" style={{ fontFamily: "Amiri, serif" }}>
            {settings?.platformName ?? "اكاديمية مستر مصطفى"}
            <br />
            <span className="text-gold/60 text-xs font-normal">{settings?.platformTagline ?? "لتدريس اللغة العربية"}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-cream/80 hover:text-gold-light text-sm transition-colors px-3 py-2"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-xl text-ink font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #8B6914)",
              boxShadow: "0 4px 16px rgba(201,168,76,0.35)",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            إنشاء حساب
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-16">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}
        >
          <span>🌟</span>
          <span className="text-gold-light text-sm" style={{ fontFamily: "Cairo, sans-serif" }}>
            المنصة التعليمية الأولى للغة العربية
          </span>
        </motion.div>

        {/* Basmala */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-gold/70 text-3xl mb-3"
          style={{ fontFamily: "Amiri, serif" }}
        >
          ﷽
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-amiri text-gold-light mb-3 leading-tight"
          style={{
            fontFamily: "Amiri, serif",
            fontSize: "clamp(36px, 7vw, 72px)",
          }}
        >
          {settings?.heroTitle ?? "اتقن اللغة العربية"}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-amiri text-gold/70 mb-6 font-normal"
          style={{
            fontFamily: "Amiri, serif",
            fontSize: "clamp(20px, 4vw, 38px)",
          }}
        >
          {settings?.heroSubtitle ?? "مع نخبة من أفضل الأساتذة"}
        </motion.h2>

        {/* Ornamental divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.5))" }} />
          <span className="text-gold/60 text-xl" style={{ fontFamily: "Amiri, serif" }}>✦</span>
          <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.5))" }} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-cream/70 mb-10 leading-relaxed max-w-lg mx-auto"
          style={{ fontFamily: "Cairo, sans-serif", fontSize: "clamp(15px, 2.5vw, 18px)", lineHeight: 1.9 }}
        >
          {settings?.heroDesc ?? "انضم إلى آلاف الطلاب في رحلة تعليمية استثنائية تجمع بين الأصالة والحداثة"}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            href="/register"
            className="px-10 py-4 rounded-2xl text-ink font-bold text-lg transition-all hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #8B6914)",
              boxShadow: "0 6px 24px rgba(201,168,76,0.4)",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            ابدأ رحلتك الآن 🚀
          </Link>
          <Link
            href="/login"
            className="px-10 py-4 rounded-2xl font-semibold text-lg transition-all hover:-translate-y-1"
            style={{
              border: "1.5px solid rgba(201,168,76,0.4)",
              color: "#E8C97A",
              background: "rgba(201,168,76,0.08)",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            تسجيل الدخول
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex gap-10 justify-center flex-wrap mt-16"
        >
          {statsBar.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-gold" style={{ fontFamily: "Amiri, serif" }}>
                {s.value}
              </div>
              <div className="text-cream/55 text-xs mt-1" style={{ fontFamily: "Cairo, sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-gold/40 text-xs" style={{ fontFamily: "Cairo, sans-serif" }}>اكتشف المزيد</span>
        <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)" }} />
      </motion.div>
    </section>
  );
}
