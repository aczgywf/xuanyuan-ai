import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { checkAndDeductCredit } from "@/lib/credits"
import { cuid } from "@/lib/db";
import OpenAI from "openai";

const deepseek = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY || "dummy", baseURL: "https://api.deepseek.com/v1" });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const userId = session.user.id;
  const creditResult = await checkAndDeductCredit(userId);
  if (!creditResult.success) return NextResponse.json({ error: "积分不足" }, { status: 402 });

  try {
    const { message, conversationId } = await req.json();
    if (!message) return NextResponse.json({ error: "消息不能为空" }, { status: 400 });

    let conversation: any;
    if (conversationId) {
      const rows = await sql`SELECT * FROM conversations WHERE id = ${conversationId} AND user_id = ${userId}`;
      conversation = rows.rows[0];
    }

    if (!conversation) {
      const newId = cuid();
      await sql`INSERT INTO conversations (id, user_id, title) VALUES (${newId}, ${userId}, ${message.slice(0, 30)})`;
      conversation = { id: newId };
    }

    await sql`INSERT INTO messages (id, conversation_id, role, content) VALUES (${cuid()}, ${conversation.id}, 'user', ${message})`;

    const history = await sql`SELECT role, content FROM messages WHERE conversation_id = ${conversation.id} ORDER BY created_at ASC`;

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "system", content: "你是一个有帮助的 AI 助手，用中文回答用户问题。" }, ...history.rows.map((m: any) => ({ role: m.role, content: m.content }))],
      max_tokens: 2048,
    });

    const reply = completion.choices[0]?.message?.content || "抱歉，我无法回复。";
    await sql`INSERT INTO messages (id, conversation_id, role, content) VALUES (${cuid()}, ${conversation.id}, 'assistant', ${reply})`;
    await sql`UPDATE conversations SET updated_at = NOW() WHERE id = ${conversation.id}`;

    return NextResponse.json({ reply, conversationId: conversation.id, remaining: creditResult.remaining });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "对话失败" }, { status: 500 });
  }
}
