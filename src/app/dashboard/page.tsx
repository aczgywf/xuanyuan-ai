import { auth } from "@/lib/auth-edge";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MessageSquare, Image, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">你好，{session?.user?.email?.split("@")[0] || "用户"}</h1>
          <p className="mt-1 text-foreground/50">选择一个模式开始创作</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/chat"
            className="group rounded-xl border border-surface-dark bg-white p-8 transition hover:border-primary/30 hover:shadow-sm"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">AI 对话</h2>
            <p className="mt-1.5 text-sm text-foreground/50">
              与 DeepSeek V4 Flash 进行智能对话，写作、翻译、编程等
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              开始对话 <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/image-gen"
            className="group rounded-xl border border-surface-dark bg-white p-8 transition hover:border-accent/30 hover:shadow-sm"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Image className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-lg font-semibold">AI 生图</h2>
            <p className="mt-1.5 text-sm text-foreground/50">
              结构化选择参数，自动生成高质量图片，灵活掌控出图效果
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
              开始生图 <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
