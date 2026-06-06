import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const { sql } = await import("@vercel/postgres");
  const result = await sql`SELECT credits FROM users WHERE id = ${session.user.id}`;
  return NextResponse.json({ credits: result.rows[0]?.credits ?? 0 });
}
