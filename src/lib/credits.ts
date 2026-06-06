async function getSql() {
  const { sql } = await import("@vercel/postgres");
  return sql;
}

export async function checkAndDeductCredit(
  userId: string
): Promise<{ success: true; remaining: number } | { success: false; remaining: 0 }> {
  const s = await getSql();
  const user = await s`SELECT credits FROM users WHERE id = ${userId}`;
  if (user.rows.length === 0 || user.rows[0].credits < 1) return { success: false, remaining: 0 };
  const updated = await s`UPDATE users SET credits = credits - 1 WHERE id = ${userId} RETURNING credits`;
  return { success: true, remaining: updated.rows[0].credits };
}

export async function getCredits(userId: string): Promise<number> {
  const s = await getSql();
  const result = await s`SELECT credits FROM users WHERE id = ${userId}`;
  return result.rows[0]?.credits ?? 0;
}
