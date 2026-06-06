"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Sparkles, Mail, KeyRound } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("注册成功！获得 5 积分");
      router.push("/login");
    } else {
      const data = await res.json();
      toast.error(data.error || "注册失败");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">注册轩辕 AI</h1>
          <p className="mt-1.5 text-sm text-foreground/50">
            注册即送 5 积分免费体验
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">
              <Mail className="mr-1.5 inline h-3.5 w-3.5" />
              邮箱
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-surface-dark bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">
              <KeyRound className="mr-1.5 inline h-3.5 w-3.5" />
              密码
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-surface-dark bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="至少 6 个字符"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/50">
          已有账号？{" "}
          <Link href="/login" className="text-primary hover:underline">
            去登录
          </Link>
        </p>
      </div>
    </div>
  );
}
