import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth(async function middleware(req) {
  const pathname = req.nextUrl.pathname

  const isAuth = await getToken({ req })
  const isLoginPage = pathname.startsWith('/login')

  const sensistiveRoutes = ['/dashboard']
  const isSensitiveRoute = sensistiveRoutes.some((route) => pathname.startsWith(route))

  if(isLoginPage){
    if(isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }
  if(!isAuth && isSensitiveRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if(pathname === '/'){
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
}, 
{
  callbacks: {
    authorized() {
      return true
    }
  },
});

export const config = { matcher: ["/", "/login", "/dashboard/:path*"] };
