import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { assemblePrompt } from "@/lib/prompt-assembly";

function cuid(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = session.user.id;

  const { sql } = await import("@vercel/postgres");

  const user = await sql`SELECT credits FROM users WHERE id = ${userId}`;
  if (user.rows.length === 0 || user.rows[0].credits < 1) return NextResponse.json({ error: "积分不足" }, { status: 402 });
  const updated = await sql`UPDATE users SET credits = credits - 1 WHERE id = ${userId} RETURNING credits`;
  const remaining = updated.rows[0].credits;

  try {
    const { imageType, ratio, style, scene, whitespace, topic, extras } = await req.json();
    if (!topic) return NextResponse.json({ error: "主题不能为空" }, { status: 400 });

    const prompt = assemblePrompt({
      imageType: imageType || "插画", ratio: ratio || "1:1", style: style || "写实摄影",
      scene: scene || "", whitespace: whitespace || "", topic, extras: extras || "",
    });

    let imageUrl: string | null = null;
    const seedreamKey = process.env.SEEDREAM_API_KEY;
    if (seedreamKey) {
      try {
        const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${seedreamKey}` },
          body: JSON.stringify({ model: "doubao-seedream-5-0-260128", prompt, size: "2K", response_format: "url", watermark: false }),
        });
        if (response.ok) { const data = await response.json(); imageUrl = data.data?.[0]?.url || null; }
      } catch {}
    }

    const id = cuid();
    await sql`INSERT INTO image_generations (id, user_id, image_type, ratio, style, scene, whitespace, topic, extras, assembled_prompt, image_url) VALUES (${id}, ${userId}, ${imageType || "插画"}, ${ratio || "1:1"}, ${style || "写实摄影"}, ${scene || ""}, ${whitespace || ""}, ${topic}, ${extras || ""}, ${prompt}, ${imageUrl})`;

    return NextResponse.json({ id, imageUrl, assembledPrompt: prompt, remaining });
  } catch (error: any) { return NextResponse.json({ error: error.message || "生成失败" }, { status: 500 }); }
}
