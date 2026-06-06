import { auth } from "@/lib/auth-edge";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard", "/chat", "/image-gen", "/history"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/image-gen/:path*", "/history/:path*"],
};
