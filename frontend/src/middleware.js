import { NextResponse } from 'next/server'

// Middleware function
export function middleware(req) {
    // Example 1: Redirect if user tries to access admin without auth
    const login_id = req.cookies.get('admin_token')
    console.log(login_id)
    if (req.nextUrl.pathname.startsWith('/admin') && !login_id) {
        return NextResponse.redirect(new URL('/admin-auth/login', req.url))
    }
    else {
        // Default: continue request
        return NextResponse.next()
    }
}

// Match specific routes (optional)
export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
