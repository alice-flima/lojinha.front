import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "../auth";

export function api_middleware(param: any) {
  return async (request: NextRequest) => {
  const session = await auth.api.getSession({
     headers: await headers()
   });
 if (!session) {
 return NextResponse.json(
 { success: false, message: "Usuário não autenticado" },
 { status: 401 }
 );
 }
 // Continua a request normalmente se autenticado
  return param(request, session.user);
  };
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/api/compras/:path*",
    "/api/produtos/:path*"
  ],
};