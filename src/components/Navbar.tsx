"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditDisplay } from "@/components/CreditDisplay";
import { MessageSquare, Image, History, LogOut, Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-surface-dark bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Sparkles className="h-5 w-5" />
          轩辕 AI
        </Link>

        <div className="flex items-center gap-1">
          <NavLink href="/dashboard" active={pathname === "/dashboard"}>
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">模式</span>
          </NavLink>
          <NavLink href="/chat" active={pathname.startsWith("/chat")}>
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">对话</span>
          </NavLink>
          <NavLink href="/image-gen" active={pathname === "/image-gen"}>
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">生图</span>
          </NavLink>
          <NavLink href="/history" active={pathname === "/history"}>
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">历史</span>
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <CreditDisplay key="credits" />
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-foreground/60 transition hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">退出</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition ${
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-foreground/60 hover:bg-surface-dark hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
