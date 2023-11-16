import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname

        const isAuth = await getToken({req})
        const isLogin = pathname.startsWith('/login');
        const sensitiveRoutes = ['dashboard']
        const isAccessingSensitiveRoute = sensitiveRoutes.some((route) => pathname.startsWith(`/${route}`))

        if(isLogin){
            if(isAuth){
                return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
            }   

            return NextResponse.next()
        }

        if(!isAuth && isAccessingSensitiveRoute){
            return NextResponse.redirect(new URL('/login', req.nextUrl))
        }

        if(pathname === '/'){
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
        }
    },
    {
        callbacks:{
            async authorized(){
                return true
            }
        } 
    }
        
)

export const config = {
    matchter: ['/', 'login', 'dashboard:path']
}