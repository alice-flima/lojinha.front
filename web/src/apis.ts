import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth"; 


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Usuário não autenticado" },
      { status: 401 }
    );
  }
  return NextResponse.next();
}
export const config = {
  runtime: "nodejs",
  matcher: [
    "/api/compras/:path*",
    "/api/produtos/:path*",
  ],
};
