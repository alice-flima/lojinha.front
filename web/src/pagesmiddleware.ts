import { NextRequest, NextResponse } from "next/server";
import { authClientEdge } from "./lib/client-edge"; 
import type { Role } from "./generated/prisma"; 

const ROUTE_CONFIG = {
  authRequired: ["/dashboard", "/perfil", "/settings"],
  adminRequired: ["/admin/**"],
  redirectIfAuth: ["/login", "/cadastro"],
  specialRoutes: ["/admin"],
};

interface UserWithRole {
  role?: Role;
  id?: string;
  email?: string;
  [key: string]: unknown;
}

function matchesAnyPattern(pathname: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('**')) return pathname.startsWith(pattern.slice(0, -2));
    return pathname === pattern || pathname.startsWith(pattern + '/');
  });
}

function hasRequiredRole(userRole: Role | undefined, requiredRoles: Role[]): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

export async function pagesMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session } = await authClientEdge.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  });

  const user = session?.user as UserWithRole | undefined;
  const userRole = user?.role;
  const isAuthenticated = !!session?.user;

  if (pathname === "/admin") {
    if (!isAuthenticated) return NextResponse.next();
    
    if (hasRequiredRole(userRole, ["ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (matchesAnyPattern(pathname, ROUTE_CONFIG.redirectIfAuth)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/aprender", request.url));
    }
    return NextResponse.next();
  }

  if (matchesAnyPattern(pathname, ROUTE_CONFIG.adminRequired)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (!hasRequiredRole(userRole, ["ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (matchesAnyPattern(pathname, ROUTE_CONFIG.authRequired)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}