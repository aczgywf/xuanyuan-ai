import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

function cuid(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "密码至少 6 个字符" }, { status: 400 });

    const { sql } = await import("@vercel/postgres");
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.rows.length > 0) return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const id = cuid();
    await sql`INSERT INTO users (id, email, password_hash, credits) VALUES (${id}, ${email}, ${passwordHash}, 5)`;
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "注册失败，请重试" }, { status: 500 }); }
}
