import { query } from "@/lib/db";

export async function checkAndDeductCredit(
  userId: string
): Promise<{ success: true; remaining: number } | { success: false; remaining: 0 }> {
  const user = await query("SELECT credits FROM users WHERE id = $1", [userId]);
  if (user.rows.length === 0 || user.rows[0].credits < 1) return { success: false, remaining: 0 };
  const updated = await query("UPDATE users SET credits = credits - 1 WHERE id = $1 RETURNING credits", [userId]);
  return { success: true, remaining: updated.rows[0].credits };
}

export async function getCredits(userId: string): Promise<number> {
  const result = await query("SELECT credits FROM users WHERE id = $1", [userId]);
  return result.rows[0]?.credits ?? 0;
}
