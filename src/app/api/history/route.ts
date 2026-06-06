import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const url = new URL(req.url);
  const conversationId = url.searchParams.get("conversationId");

  if (conversationId) {
    const conv = await query("SELECT id FROM conversations WHERE id = $1 AND user_id = $2", [conversationId, session.user.id]);
    if (conv.rows.length === 0) return NextResponse.json({ error: "对话不存在" }, { status: 404 });
    const msgs = await query("SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC", [conversationId]);
    return NextResponse.json({ messages: msgs.rows });
  }

  const conversations = await query(
    `SELECT c.id, c.title, c.updated_at as "updatedAt", COUNT(m.id)::int as "messageCount"
     FROM conversations c LEFT JOIN messages m ON m.conversation_id = c.id
     WHERE c.user_id = $1 GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 50`, [session.user.id]
  );

  const images = await query(
    `SELECT id, image_type as "imageType", topic, image_url as "imageUrl", created_at as "createdAt"
     FROM image_generations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`, [session.user.id]
  );

  return NextResponse.json({ conversations: conversations.rows, images: images.rows });
}
