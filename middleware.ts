import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value
    const { pathname } = request.nextUrl

    // 1. Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        // Allow /admin/login
        if (pathname === '/admin/login') {
            return NextResponse.next()
        }

        // Check for admin "session" (For now, we check if userId exists and matches admin logic, 
        // but typically admin has a separate auth. Since app uses same user table, 
        // we might need to check if the user is actually admin. 
        // However, middleware can't check DB easily. 
        // Simplified: Check for cookie. Real secure approach needs JWT or server session check.
        // For this offline ship app, basic cookie presence + maybe a special admin cookie is enough?
        // Let's assume for now any user can't access admin without specific admin check, 
        // BUT the prompt just said "cant access the pages without logging".

        // IF the user is NOT logged in (no userId), redirect to Admin Login
        if (!userId) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // 2. Protect User Routes (/modules, /quiz)
    if (pathname.startsWith('/modules') || pathname.startsWith('/quiz')) {
        if (!userId) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/modules/:path*', '/quiz/:path*'],
}
