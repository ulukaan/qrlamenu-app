import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Herkese Açık (Auth gerektirmeyen) Path'ler ─────────────────────────────
const PUBLIC_PREFIXES = [
    '/',                            // Landing page
    '/login',
    '/giris',
    '/iletisim',
    '/hakkimizda',
    '/gizlilik',
    '/kullanim',
    '/r',                           // Müşteri QR menüsü
    '/api/auth',                    // Auth endpoint'leri
    '/api/restaurant/orders',       // Müşteri sipariş
    '/api/restaurant/waiter-calls', // Garson çağır
    '/api/restaurant/campaigns/public', // Kampanyalar
    '/api/admin/seed',              // Kurulum için geçici açık yol
    '/sitemap',
    '/robots',
    '/favicon',
];

// ── Super Admin Path'leri (özel kontrol) ─────────────────────────────────────
const SUPER_ADMIN_PREFIXES = ['/super-admin'];

// ── Basit Edge Rate Limiter (Isolate başına) ───────────────────────────────
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const MAX_REQUESTS = 200; // IP başına 1 dakikada maksimum limit
const WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return true;
    }
    if (record.count >= MAX_REQUESTS) return false;
    record.count++;
    return true;
}

// ── Zararlı URL/Sorgu Koruması (WAF Temelleri) ─────────────────────────────
function hasMaliciousPatterns(url: string, userAgent: string): boolean {
    const patterns = [
        /(?:\.\.\/|\.\.\\)/i,     // Path traversal
        /(?:<script>|<\/script>)/i, // XSS in URL
        /(?:%3Cscript%3E)/i,      // URL Encoded XSS
        /(?:UNION\s+SELECT|DROP\s+TABLE)/i, // Basic SQLi
        /(?:etc\/passwd|boot\.ini)/i // LFI Denemeleri
    ];

    const badAgents = [
        /sqlmap/i,
        /nmap/i,
        /nikto/i,
        /curl/i,
        /wget/i,
        /python-requests/i,
        /libwww-perl/i
    ];

    return patterns.some(pattern => pattern.test(url)) || badAgents.some(agent => agent.test(userAgent));
}

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function isSuperAdminPath(pathname: string): boolean {
    return SUPER_ADMIN_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

/** Token'ı cookie'den çek ve temel doğrulama yap */
function getToken(req: NextRequest, cookieName: string): string | null {
    const value = req.cookies.get(cookieName)?.value ?? null;
    // Minimum güvenlik: boş veya çok kısa token'ları reddet
    if (!value || value.length < 32) return null;
    return value;
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const hostname = req.headers.get('host') ?? '';
    const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';

    // ── 1. Güvenlik Duvarı Ön Kontrolleri (WAF) ──────────────────────────────
    if (hasMaliciousPatterns(pathname + search, userAgent)) {
        return new NextResponse('Bad Request - Güvenlik İhlali Tespit Edildi veya İstemci Desteklenmiyor', { status: 400 });
    }

    // ── 2. Rate Limiting Kontrolü (DDoS / Brute Force önlemi) ────────────────
    // Statik dosyalarda limit uygulamamaya özen gösterilir, ancak matcher bunu zaten filtreliyor.
    if (!checkRateLimit(ip)) {
        return new NextResponse('Çok Fazla İstek (Rate Limit Aşımı)', { status: 429 });
    }

    // ── Custom Domain Yönlendirmesi ──────────────────────────────────────────
    const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? 'localhost';

    // Hostname'den portu ve www'yu temizle (örn: www.qrlamenu.com:3000 -> qrlamenu.com)
    const cleanHostname = hostname.split(':')[0].replace(/^www\./, '');
    const cleanMainDomain = mainDomain.split(':')[0].replace(/^www\./, '');

    const isMainOrLocal =
        cleanHostname === 'localhost' ||
        cleanHostname === '127.0.0.1' ||
        cleanHostname.endsWith('loca.lt') ||
        cleanHostname === cleanMainDomain ||
        hostname.includes(mainDomain);

    if (!isMainOrLocal && cleanHostname !== '') {
        // Eğer bir custom domain ise, onu /custom-domain/ altına ata (opsiyonel/gelecek planı)
        // Ancak şimdilik 404 almamak için eğer bu klasör yoksa landing page'e izin verilebilir.
        // return NextResponse.rewrite(new URL(`/custom-domain/${hostname}${pathname}`, req.url));

        // Şimdilik: Eğer main domain değilse ve bir subdomain ise (örn: restoran1.qrlamenu.com)
        // Burayı ileride restaurant slug logic'i ile bağlayabiliriz.
    }

    // ── Public path kontrolü ─────────────────────────────────────────────────
    // Sadece tam eşleşen anasayfa ve public prefix'leri kontrol et
    if (pathname === '/') {
        return NextResponse.next();
    }

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    const authToken = getToken(req, 'auth-token');

    // ── Super Admin özel koruma ──────────────────────────────────────────────
    if (isSuperAdminPath(pathname)) {
        if (!authToken) {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('redirect', pathname);
            loginUrl.searchParams.set('reason', 'unauthorized');
            return NextResponse.redirect(loginUrl);
        }
        // Token var ama bu kullanıcının gerçekten SUPER_ADMIN olup olmadığını
        // middleware'de DB sorgusu yapamayız (Edge Runtime kısıtı).
        // Rol kontrolü sayfa seviyesinde validateSession ile yapılıyor.
        return NextResponse.next();
    }

    // ── Debug API'leri production'da tamamen engelle ─────────────────────────
    if (pathname.startsWith('/api/debug')) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
    }

    // ── Genel Authenticated alan koruması ─────────────────────────────────────
    if (!authToken) {
        // Login/giris sayfasındaysa yönlendirme döngüsü olmasın
        if (pathname === '/login' || pathname === '/giris') {
            return NextResponse.next();
        }
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();

    // ── Cookie Güvenliğini (Secure, HttpOnly, SameSite) Zorla ────────────────
    if (authToken) {
        response.cookies.set('auth-token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Şunlar HARİÇ tüm pathler eşleştir:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public dizini (images, icons)
         */
        '/((?!_next/static|_next/image|favicon.ico|icons|images).*)',
    ],
};
