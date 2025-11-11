import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "../auth";

export async function middleware(req: NextRequest){
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
 return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/compras/:path*",
    "/api/produtos/:path*"
  ],
};