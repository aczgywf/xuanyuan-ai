"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import toast from "react-hot-toast";
import { Image, Loader2, Download } from "lucide-react";

const IMAGE_TYPES = ["插画", "头像", "海报", "壁纸", "Logo", "UI 界面", "3D 渲染", "其他"];
const RATIOS = ["1:1", "4:3", "3:4", "16:9", "9:16"];
const STYLES = ["写实摄影", "扁平插画", "水彩", "赛博朋克", "油画", "水墨画", "卡通", "极简", "像素风", "其他"];
const SCENES = ["自然风光", "城市建筑", "室内场景", "科幻太空", "古风", "奇幻", "日常", "抽象", "其他"];
const WHITESPACES = ["无留白", "少量留白", "适中留白", "大量留白"];

export default function ImageGenPage() {
  const router = useRouter();
  const [imageType, setImageType] = useState("插画");
  const [ratio, setRatio] = useState("1:1");
  const [style, setStyle] = useState("写实摄影");
  const [scene, setScene] = useState("自然风光");
  const [whitespace, setWhitespace] = useState("适中留白");
  const [topic, setTopic] = useState("");
  const [extras, setExtras] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [assembledPrompt, setAssembledPrompt] = useState("");

  async function handleGenerate() {
    if (!topic.trim()) {
      toast.error("请输入主题");
      return;
    }
    setLoading(true);
    setResultUrl(null);

    try {
      const res = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageType, ratio, style, scene, whitespace, topic, extras }),
      });

      if (res.status === 402) {
        toast.error("积分不足，请升级账户");
        router.push("/upgrade");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成失败");
      }

      const data = await res.json();
      setResultUrl(data.imageUrl);
      setAssembledPrompt(data.assembledPrompt);
    } catch (e: any) {
      toast.error(e.message || "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-xl font-bold">AI 生图</h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <SelectGroup label="图片类型" value={imageType} onChange={setImageType} options={IMAGE_TYPES} />
            <SelectGroup label="比例" value={ratio} onChange={setRatio} options={RATIOS} />
            <SelectGroup label="风格" value={style} onChange={setStyle} options={STYLES} />
            <SelectGroup label="场景" value={scene} onChange={setScene} options={SCENES} />
            <SelectGroup label="留白" value={whitespace} onChange={setWhitespace} options={WHITESPACES} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/70">主题</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-surface-dark bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="描述你想生成的内容，如：一只猫"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/70">补充要求</label>
              <input
                value={extras}
                onChange={(e) => setExtras(e.target.value)}
                className="w-full rounded-lg border border-surface-dark bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="其他细节（可选）"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> 生成中...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4" /> 生成图片（-1 积分）
                </>
              )}
            </button>
          </div>

          <div>
            <div className="aspect-square w-full rounded-xl border border-surface-dark bg-white flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center gap-2 text-foreground/30">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-sm">生成中...</span>
                </div>
              ) : resultUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={resultUrl}
                    alt="生成的图片"
                    className="h-full w-full object-cover"
                  />
                  <a
                    href={resultUrl}
                    target="_blank"
                    className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white transition hover:bg-black/80"
                  >
                    <Download className="h-3.5 w-3.5" /> 下载
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-foreground/20">
                  <Image className="h-10 w-10" />
                  <span className="text-sm">选择参数后生成</span>
                </div>
              )}
            </div>
            {assembledPrompt && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-foreground/40 hover:text-foreground/60">
                  查看组装的提示词
                </summary>
                <p className="mt-1 rounded-lg bg-surface-dark p-3 text-xs text-foreground/60">{assembledPrompt}</p>
              </details>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SelectGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground/70">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              value === opt
                ? "bg-primary text-white"
                : "bg-white border border-surface-dark text-foreground/60 hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
