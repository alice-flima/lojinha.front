import { NextRequest, NextResponse } from "next/server";
import { apiMiddleware } from "./apismiddleware";
import { pagesMiddleware} from "./pagesmiddleware"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return apiMiddleware(request);
  }

  return pagesMiddleware(request);
}

export const config = {
  matcher: ["/api/:path*"],
};
