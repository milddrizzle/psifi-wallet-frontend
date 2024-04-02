import { NextRequest, NextResponse } from "next/server";

const publicPages = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const formattedPublicPages = publicPages
    .map((p) => (p === "/" ? ["", "/"] : p))
    .flat(); // Flatten the array here to ensure proper joining

  const publicPathnameRegex = new RegExp(
    `^(${formattedPublicPages.join("|")})/?$`,
    "i"
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return NextResponse.next();
  }

  const cookiesHeader = req.headers.get("Cookie");
  let user;

  if (cookiesHeader) {
    const cookies = cookiesHeader
      .split(";")
      .map((cookie) => cookie.split("="))
      .reduce(
        (accum, [key, value]) => ({
          ...accum,
          [key.trim()]: decodeURIComponent(value),
        }),
        {}
      );

    user = "user" in cookies ? cookies.user : "";
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
