import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the protected routes that require authentication
const protectedRoutes: string[] = [
    // Temporarily comment these out for debugging
    // '/account',
    // '/ai-access',
];

export function middleware(request: NextRequest) {
    // Get the user's auth info from the cookie
    const authCookie = request.cookies.get('pb_auth');
    const isLoggedIn = !!authCookie?.value; // Check if the auth cookie exists and has a value
    const { pathname } = request.nextUrl;

    // Check if the route requires authentication
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // If the route is protected and the user is not logged in, redirect to login
    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL('/login', request.url);
        // Add a 'from' parameter to remember where to redirect after login
        // Remove any leading slash to prevent double encoding
        const redirectPath = pathname.startsWith('/') ? pathname.substring(1) : pathname;
        loginUrl.searchParams.set('from', redirectPath + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    // If the route is login/sign-in and the user is already logged in, redirect to dashboard
    if ((pathname === '/login' || pathname === '/sign-in') && isLoggedIn) {
        // Check if there's a 'from' parameter to redirect back to the original page
        const from = request.nextUrl.searchParams.get('from');
        if (from) {
            // Make sure to add the leading slash if it's not there
            const redirectPath = from.startsWith('/') ? from : `/${from}`;
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
        return NextResponse.redirect(new URL('/ai-access', request.url));
    }

    return NextResponse.next();
}

// Configure the matcher to run the middleware on specific routes
export const config = {
    matcher: [
        /*
         * Match all routes except:
         * 1. /_next (Next.js internals)
         * 2. /static (static files)
         * 3. /favicon.ico, /robots.txt (static files at root)
         */
        '/((?!_next|static|favicon.ico|robots.txt).*)',
    ],
}; 