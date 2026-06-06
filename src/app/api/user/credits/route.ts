import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCredits } from "@/lib/credits";
import { ensureTables } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });
  await ensureTables();
  const credits = await getCredits(session.user.id);
  return NextResponse.json({ credits });
}
