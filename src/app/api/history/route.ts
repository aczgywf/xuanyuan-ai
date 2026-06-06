import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const url = new URL(req.url);
  const conversationId = url.searchParams.get("conversationId");

  if (conversationId) {
    const conv = await sql`SELECT id FROM conversations WHERE id = ${conversationId} AND user_id = ${session.user.id}`;
    if (conv.rows.length === 0) return NextResponse.json({ error: "对话不存在" }, { status: 404 });

    const msgs = await sql`SELECT role, content FROM messages WHERE conversation_id = ${conversationId} ORDER BY created_at ASC`;
    return NextResponse.json({ messages: msgs.rows });
  }

  const conversations = await sql`
    SELECT c.id, c.title, c.updated_at as "updatedAt", COUNT(m.id)::int as "messageCount"
    FROM conversations c LEFT JOIN messages m ON m.conversation_id = c.id
    WHERE c.user_id = ${session.user.id}
    GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 50
  `;

  const images = await sql`
    SELECT id, image_type as "imageType", topic, image_url as "imageUrl", created_at as "createdAt"
    FROM image_generations WHERE user_id = ${session.user.id}
    ORDER BY created_at DESC LIMIT 50
  `;

  return NextResponse.json({ conversations: conversations.rows, images: images.rows });
}
