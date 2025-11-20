import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth"; 
import { handleError } from "./app/(backend)/api/errors/Erro";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  try{
  const session = await auth.api.getSession({
    headers: request.headers,
  });
}
  catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });

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
