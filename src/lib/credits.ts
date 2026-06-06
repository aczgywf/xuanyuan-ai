import { sql } from "@vercel/postgres";

export async function checkAndDeductCredit(
  userId: string
): Promise<{ success: true; remaining: number } | { success: false; remaining: 0 }> {
  const user = await sql`SELECT credits FROM users WHERE id = ${userId}`;
  if (user.rows.length === 0 || user.rows[0].credits < 1) return { success: false, remaining: 0 };
  const updated = await sql`UPDATE users SET credits = credits - 1 WHERE id = ${userId} RETURNING credits`;
  return { success: true, remaining: updated.rows[0].credits };
}

export async function getCredits(userId: string): Promise<number> {
  const result = await sql`SELECT credits FROM users WHERE id = ${userId}`;
  return result.rows[0]?.credits ?? 0;
}
