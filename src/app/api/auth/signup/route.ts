import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, cuid, ensureTables } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await ensureTables();
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "密码至少 6 个字符" }, { status: 400 });

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    await query("INSERT INTO users (id, email, password_hash, credits) VALUES ($1, $2, $3, 5)", [cuid(), email, passwordHash]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Signup error:", e.message);
    return NextResponse.json({ error: "注册失败，请重试" }, { status: 500 });
  }
}
