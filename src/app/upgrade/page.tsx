import { Navbar } from "@/components/Navbar";
import { Coins, ArrowRight } from "lucide-react";

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Coins className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">积分不足</h1>
        <p className="mt-2 text-foreground/50">
          您的免费积分已用完。升级账户即可继续畅享 AI 对话与生图。
        </p>

        <div className="mt-10 rounded-xl border border-surface-dark bg-white p-8">
          <div className="mb-4 text-3xl font-bold text-primary">¥29<span className="text-base font-normal text-foreground/40">/月</span></div>
          <ul className="space-y-2 text-left text-sm text-foreground/60">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> 每月 500 次 AI 对话
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> 每月 500 次 AI 生图
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> 优先队列，更快响应
            </li>
          </ul>
          <button
            disabled
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-surface-dark bg-surface-dark px-4 py-3 text-sm font-medium text-foreground/40 cursor-not-allowed"
          >
            即将上线 <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-xs text-foreground/30">支付功能即将上线，敬请期待</p>
        </div>
      </main>
    </div>
  );
}
