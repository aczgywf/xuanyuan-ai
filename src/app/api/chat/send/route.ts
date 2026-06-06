import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, cuid, ensureTables } from "@/lib/db";
import { checkAndDeductCredit } from "@/lib/credits";
import OpenAI from "openai";

const deepseek = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY || "dummy", baseURL: "https://api.deepseek.com/v1" });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });
  await ensureTables();
  const userId = session.user.id;
  const creditResult = await checkAndDeductCredit(userId);
  if (!creditResult.success) return NextResponse.json({ error: "积分不足" }, { status: 402 });

  try {
    const { message, conversationId } = await req.json();
    if (!message) return NextResponse.json({ error: "消息不能为空" }, { status: 400 });

    let convId = conversationId;
    let exists = false;
    if (convId) {
      const r = await query("SELECT id FROM conversations WHERE id = $1 AND user_id = $2", [convId, userId]);
      exists = r.rows.length > 0;
    }
    if (!exists) {
      convId = cuid();
      await query("INSERT INTO conversations (id, user_id, title) VALUES ($1, $2, $3)", [convId, userId, message.slice(0, 30)]);
    }

    await query("INSERT INTO messages (id, conversation_id, role, content) VALUES ($1, $2, 'user', $3)", [cuid(), convId, message]);

    const history = await query("SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC", [convId]);

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "system", content: "你是一个有帮助的 AI 助手，用中文回答用户问题。" }, ...history.rows.map((m: any) => ({ role: m.role, content: m.content }))],
      max_tokens: 2048,
    });

    const reply = completion.choices[0]?.message?.content || "抱歉，我无法回复。";
    await query("INSERT INTO messages (id, conversation_id, role, content) VALUES ($1, $2, 'assistant', $3)", [cuid(), convId, reply]);
    await query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [convId]);

    return NextResponse.json({ reply, conversationId: convId, remaining: creditResult.remaining });
  } catch (error: any) { return NextResponse.json({ error: error.message || "对话失败" }, { status: 500 }); }
}
