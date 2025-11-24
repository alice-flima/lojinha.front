import { NextRequest, NextResponse } from "next/server";
import { authClientEdge } from "./lib/client-edge"; 

export async function apiMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  try {
    const { data: session } = await authClientEdge.getSession({
        fetchOptions: {
            headers: {
                cookie: request.headers.get("cookie") || "",
            }
        }
    });

    if (!session) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao validar sessão" },
      { status: 500 }
    );
  }
}