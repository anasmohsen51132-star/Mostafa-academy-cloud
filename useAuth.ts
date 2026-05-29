"use client";
// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/store/uiStore";
import type { LoginForm, RegisterForm } from "@/types";

async function apiFetch(url: string, options?: RequestInit) {
  const store = useAuthStore.getState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(store.token ? { Authorization: `Bearer ${store.token}` } : {}),
  };
  const res = await fetch(url, { ...options, headers: { ...headers, ...(options?.headers as Record<string, string> || {}) } });
  return res.json();
}

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const toast = useToast();
  const router = useRouter();
  const qc = useQueryClient();

  // ---- Login ----
  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) =>
      apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (res) => {
      if (res.success) {
        setAuth(res.data.user, res.data.token);
        toast.success(`🎉 أهلاً بك، ${res.data.user.name.split(" ")[0]}!`);
        const role = res.data.user.role;
        if (role === "OWNER") router.push("/owner");
        else if (role === "ADMIN") router.push("/admin");
        else router.push("/dashboard");
      } else {
        toast.error(res.error || "خطأ في تسجيل الدخول");
      }
    },
    onError: () => toast.error("حدث خطأ في الاتصال"),
  });

  // ---- Register ----
  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) =>
      apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (res) => {
      if (res.success) {
        setAuth(res.data.user, res.data.token);
        toast.success("🎉 تم إنشاء حسابك بنجاح!");
        const role = res.data.user.role;
        if (role === "OWNER") router.push("/owner");
        else router.push("/dashboard");
      } else {
        toast.error(res.error || "خطأ في إنشاء الحساب");
      }
    },
    onError: () => toast.error("حدث خطأ في الاتصال"),
  });

  // ---- Logout ----
  const logout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    clearAuth();
    qc.clear();
    toast.info("👋 تم تسجيل الخروج");
    router.push("/");
  };

  return {
    user,
    token,
    isAuthenticated: !!user,
    isOwner: user?.role === "OWNER",
    isAdmin: user?.role === "ADMIN" || user?.role === "OWNER",
    isStudent: user?.role === "STUDENT",
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.data?.error,
    registerError: registerMutation.data?.error,
    logout,
  };
}

// Generic API fetch with auth
export async function fetchWithAuth(url: string, options?: RequestInit) {
  const store = useAuthStore.getState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(store.token ? { Authorization: `Bearer ${store.token}` } : {}),
  };
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> || {}) },
  });
  return res.json();
}
