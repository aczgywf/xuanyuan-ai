"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MessageSquare, Image } from "lucide-react";

interface ConversationItem {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

interface ImageItem {
  id: string;
  imageType: string;
  topic: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [tab, setTab] = useState<"chat" | "image">("chat");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        setImages(data.images || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-xl font-bold">历史记录</h1>

        <div className="mb-4 flex gap-1 rounded-lg bg-white p-1 border border-surface-dark w-fit">
          <button
            onClick={() => setTab("chat")}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition ${
              tab === "chat" ? "bg-primary/10 text-primary" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> 对话
          </button>
          <button
            onClick={() => setTab("image")}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition ${
              tab === "image" ? "bg-primary/10 text-primary" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            <Image className="h-4 w-4" /> 生图
          </button>
        </div>

        {tab === "chat" && (
          <div className="space-y-2">
            {conversations.length === 0 && (
              <p className="py-8 text-center text-sm text-foreground/30">暂无对话记录</p>
            )}
            {conversations.map((c) => (
              <Link
                key={c.id}
                href={`/chat/${c.id}`}
                className="flex items-center justify-between rounded-lg border border-surface-dark bg-white px-4 py-3 transition hover:border-primary/30"
              >
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-foreground/40">
                    {c.messageCount} 条消息 · {new Date(c.updatedAt).toLocaleString("zh-CN")}
                  </p>
                </div>
                <MessageSquare className="h-4 w-4 text-foreground/20" />
              </Link>
            ))}
          </div>
        )}

        {tab === "image" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-foreground/30">暂无图片记录</p>
            )}
            {images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-lg border border-surface-dark bg-white">
                <div className="aspect-square bg-surface-dark">
                  {img.imageUrl ? (
                    <img src={img.imageUrl} alt={img.topic} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-foreground/20">
                      <Image className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{img.topic}</p>
                  <p className="text-xs text-foreground/40">
                    {img.imageType} · {new Date(img.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
