import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, cuid, ensureTables } from "@/lib/db";
import { checkAndDeductCredit } from "@/lib/credits";
import { assemblePrompt } from "@/lib/prompt-assembly";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });
  await ensureTables();
  const userId = session.user.id;
  const creditResult = await checkAndDeductCredit(userId);
  if (!creditResult.success) return NextResponse.json({ error: "积分不足" }, { status: 402 });

  try {
    const { imageType, ratio, style, scene, whitespace, topic, extras } = await req.json();
    if (!topic) return NextResponse.json({ error: "主题不能为空" }, { status: 400 });

    const prompt = assemblePrompt({
      imageType: imageType || "插画", ratio: ratio || "1:1", style: style || "写实摄影",
      scene: scene || "", whitespace: whitespace || "", topic, extras: extras || "",
    });

    let imageUrl: string | null = null;
    const sk = process.env.SEEDREAM_API_KEY;
    if (sk) {
      try {
        const r = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sk}` },
          body: JSON.stringify({ model: "doubao-seedream-5-0-260128", prompt, size: "2K", response_format: "url", watermark: false }),
        });
        if (r.ok) { const d = await r.json(); imageUrl = d.data?.[0]?.url || null; }
      } catch {}
    }

    const id = cuid();
    await query("INSERT INTO image_generations (id, user_id, image_type, ratio, style, scene, whitespace, topic, extras, assembled_prompt, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [id, userId, imageType || "插画", ratio || "1:1", style || "写实摄影", scene || "", whitespace || "", topic, extras || "", prompt, imageUrl]);

    return NextResponse.json({ id, imageUrl, assembledPrompt: prompt, remaining: creditResult.remaining });
  } catch (error: any) { return NextResponse.json({ error: error.message || "生成失败" }, { status: 500 }); }
}
