// Lazy-load PostgreSQL to avoid build-time connection
async function getSql() {
  const { sql } = await import("@vercel/postgres");
  return sql;
}

export function cuid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function query(text: string, params?: any[]) {
  const s = await getSql();
  return s.query(text, params);
}

let initDone = false;
async function ensureTables() {
  if (initDone) return;
  const s = await getSql();
  await s`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
    credits INTEGER DEFAULT 5, created_at TIMESTAMP DEFAULT NOW()
  )`;
  await s`CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT DEFAULT '新对话',
    created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
  )`;
  await s`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL,
    role TEXT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW()
  )`;
  await s`CREATE TABLE IF NOT EXISTS image_generations (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL, image_type TEXT NOT NULL,
    ratio TEXT NOT NULL, style TEXT NOT NULL, scene TEXT NOT NULL,
    whitespace TEXT NOT NULL, topic TEXT NOT NULL, extras TEXT DEFAULT '',
    assembled_prompt TEXT NOT NULL, image_url TEXT, created_at TIMESTAMP DEFAULT NOW()
  )`;
  initDone = true;
}

// Inline sql helper for API routes
export async function exec(strings: TemplateStringsArray, ...values: any[]) {
  await ensureTables();
  const s = await getSql();
  return s.query(strings.join("?"), values);
}
