import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host') || '';

    // 1. DYNAMIC DOMAIN DETECTION
    const isLocal = hostname.includes('localhost');
    const superAdminDomain = 'ops.nexgenos.in';

    // 2. ROUTE TO SUPER ADMIN (Logic for the "Secret" Domain)
    // If we are on the actual ops domain, we rewrite the URL to the /superadmin folder
    if (hostname === superAdminDomain) {
        if (url.pathname === '/') {
            return NextResponse.rewrite(new URL('/superadmin', req.url));
        }
        return NextResponse.rewrite(new URL(`/superadmin${url.pathname}`, req.url));
    }

    // 3. THE ACCESS GATE (This was blocking you)
    // If someone tries to go to /superadmin:
    if (url.pathname.startsWith('/superadmin')) {
        // ALLOW if: It's your local machine OR it's the official ops domain
        if (isLocal || hostname === superAdminDomain) {
            return NextResponse.next();
        }

        // REJECT everyone else (Students/Teachers trying to sneak in)
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};