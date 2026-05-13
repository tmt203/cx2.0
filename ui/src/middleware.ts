import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("Middleware run:", pathname);
  return NextResponse.next();
}

// Apply Middleware to all pages except API and Static Files
export const config = {
  matcher: ["/((?!api|_next/|favicon.ico|public/).*)"],
};
