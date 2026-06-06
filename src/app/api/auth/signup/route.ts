import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, cuid, ensureTables } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await ensureTables();
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "密码至少 6 个字符" }, { status: 400 });

    let existing;
    try {
      existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    } catch (dbErr: any) {
      return NextResponse.json({ error: "数据库连接失败: " + (dbErr.message || "").slice(0, 100) }, { status: 500 });
    }
    if (existing.rows.length > 0) return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    try {
      await query("INSERT INTO users (id, email, password_hash, credits) VALUES ($1, $2, $3, 5)", [cuid(), email, passwordHash]);
    } catch (dbErr: any) {
      return NextResponse.json({ error: "创建用户失败: " + (dbErr.message || "").slice(0, 100) }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "服务器错误: " + (e.message || "未知").slice(0, 100) }, { status: 500 });
  }
}
