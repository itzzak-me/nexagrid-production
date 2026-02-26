import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host') || '';

    // Define your domains (Change these to your actual domains)
    const superAdminDomain = 'ops.nexgenos.in';
    // const superAdminDomain = 'localhost:3000'; // Uncomment this line to test locally

    // 1. ROUTE TO SUPER ADMIN
    // If the user types the secret ops domain, silently serve the /superadmin folder
    if (hostname === superAdminDomain) {
        // If they are just at ops.nexgenos.in/, show the superadmin page
        if (url.pathname === '/') {
            return NextResponse.rewrite(new URL('/superadmin', req.url));
        }
        // Otherwise, rewrite to whatever path they are on inside superadmin
        return NextResponse.rewrite(new URL(`/superadmin${url.pathname}`, req.url));
    }

    // 2. SECURITY BLOCK
    // If a student or teacher tries to go to nexagrid.nexgenos.in/superadmin, kick them out
    if (url.pathname.startsWith('/superadmin') && hostname !== superAdminDomain) {
        return NextResponse.redirect(new URL('/', req.url)); // Send them to the normal login page
    }

    // For all other traffic, proceed as normal
    return NextResponse.next();
}

// This tells Next.js to run this middleware on every page load EXCEPT static files/images
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};