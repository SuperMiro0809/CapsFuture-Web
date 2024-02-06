import { i18n } from 'i18n.config';

import { i18nRouter } from 'next-i18n-router';

export function middleware(request) {
    return i18nRouter(request, i18n);
}

export const config = {
    // Matcher ignoring `/_next/`, `/api/`, `favicon`, `assets` and `manifest`
    matcher: ['/((?!api|_next/static|_next/image|favicon|assets|manifest|logo).*)']
}