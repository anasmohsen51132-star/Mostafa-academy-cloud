"use client";
// src/components/layout/Sidebar.tsx
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string | number;
  section?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  brandTitle?: string;
  brandSub?: string;
  role?: string;
  onLogout?: () => void;
  userName?: string;
  userAvatar?: string;
}

export function Sidebar({
  items,
  brandTitle = "اكاديمية مستر مصطفى",
  brandSub,
  onLogout,
  userName,
  userAvatar = "م",
}: SidebarProps) {
  const pathname = usePathname();

  // Group items by section
  const sections = items.reduce<Record<string, SidebarItem[]>>((acc, item) => {
    const sec = item.section || "_";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(item);
    return acc;
  }, {});

  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 right-0 h-screen w-64 bg-emerald-dark flex flex-col z-50 overflow-y-auto"
      style={{ direction: "rtl" }}
    >
      {/* Brand */}
      <div className="px-5 py-6 border-b border-gold/20">
        <div className="text-[10px] text-gold/40 font-semibold tracking-widest mb-1 uppercase" style={{ fontFamily: "Cairo, sans-serif" }}>
          {brandSub || "المنصة التعليمية"}
        </div>
        <div className="font-amiri text-gold-light text-[15px] font-bold leading-tight">
          {brandTitle}
        </div>
      </div>

      {/* User badge */}
      {userName && (
        <div className="px-5 py-4 border-b border-gold/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-emerald-light flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {userAvatar}
            </div>
            <span className="text-cream/80 text-sm truncate" style={{ fontFamily: "Cairo, sans-serif" }}>
              {userName}
            </span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 py-4">
        {Object.entries(sections).map(([section, sectionItems]) => (
          <div key={section}>
            {section !== "_" && (
              <div className="px-5 py-2 text-[10px] text-cream/30 tracking-widest uppercase font-semibold" style={{ fontFamily: "Cairo, sans-serif" }}>
                {section}
              </div>
            )}
            {sectionItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200 relative group",
                    "text-cream/70 hover:text-gold-light hover:bg-gold/10",
                    isActive && "text-gold bg-gold/15 border-r-[3px] border-gold"
                  )}
                  style={{ fontFamily: "Cairo, sans-serif" }}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-gold/10 rounded-l-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10 text-base">{item.icon}</span>
                  <span className="relative z-10 flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="relative z-10 bg-gold text-ink text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      {onLogout && (
        <div className="p-4 border-t border-gold/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cream/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </motion.aside>
  );
}
