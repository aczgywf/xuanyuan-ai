import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: { label: "邮箱" }, password: { label: "密码" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { sql } = await import("@vercel/postgres");
        const result = await sql`SELECT * FROM users WHERE email = ${credentials.email as string}`;
        if (result.rows.length === 0) return null;
        const user = result.rows[0];
        const isValid = await bcrypt.compare(credentials.password as string, user.password_hash);
        if (!isValid) return null;
        return { id: user.id, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) token.id = user.id; return token; },
    async session({ session, token }) { if (session.user) session.user.id = token.id as string; return session; },
  },
});
