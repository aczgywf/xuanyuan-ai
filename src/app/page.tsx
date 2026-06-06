import Link from "next/link";
import { auth } from "@/lib/auth-edge";
import { redirect } from "next/navigation";
import { MessageSquare, Image, Sparkles, ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 text-xl font-bold text-primary">
          <Sparkles className="h-6 w-6" />
          轩辕 AI
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition hover:text-foreground"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            免费注册
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-20 pt-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          用 AI 释放你的创造力
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60">
          智能对话与专业级图像生成，一个平台全搞定。新用户注册即送 5 积分免费体验。
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-medium text-white transition hover:bg-primary-dark"
        >
          免费开始使用
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-20 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-surface-dark bg-white p-6 text-left">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">AI 智能对话</h2>
            <p className="mt-2 text-sm text-foreground/60">
              基于 DeepSeek V4 Flash 的深度对话模型，写作、编程、翻译、头脑风暴，随问随答。
            </p>
          </div>
          <div className="rounded-xl border border-surface-dark bg-white p-6 text-left">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Image className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-lg font-semibold">专业 AI 生图</h2>
            <p className="mt-2 text-sm text-foreground/60">
              结构化选择类型、比例、风格与场景，系统自动组装高质量提示词，调用豆包 Seedream 模型生成精美图片。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
