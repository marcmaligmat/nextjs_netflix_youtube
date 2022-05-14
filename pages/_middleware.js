import { NextResponse } from "next/server"

export async function middleware(req) {
  const token = req ? req.cookies?.token : null

  const { pathname } = req.nextUrl.clone()

  // if (token && pathname === "/login") {
  //   const url = req.nextUrl.clone()
  //   url.pathname = "/"
  //   return NextResponse.redirect(url)
  // }

  if (pathname.includes(`/api/login`) || pathname.includes("/static")) {
    return NextResponse.next()
  }

  if (!token && pathname !== "/login") {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }
}
