import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, createSession } from '@/lib/auth';

// Basit rate-limit: IP başına son 10 başarısız denemede 15 dk kilit
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    return (forwarded?.split(',')[0] ?? 'unknown').trim();
}

// Geliştirme ortamı veya localhost ise rate limit uygulanmaz
function isExemptFromRateLimit(ip: string): boolean {
    if (process.env.NODE_ENV !== 'production') return true;
    return ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');
}

function checkRateLimit(ip: string): boolean {
    if (isExemptFromRateLimit(ip)) return true; // localhost / dev ortamında sınır yok
    const now = Date.now();
    const attempts = loginAttempts.get(ip);
    if (!attempts) return true;

    // 15 dakika geçtiyse sıfırla
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
        loginAttempts.delete(ip);
        return true;
    }

    return attempts.count < 10;
}

function recordFailedAttempt(ip: string) {
    if (isExemptFromRateLimit(ip)) return; // localhost / dev ortamında kayıt tutma
    const now = Date.now();
    const attempts = loginAttempts.get(ip) ?? { count: 0, lastAttempt: now };
    loginAttempts.set(ip, { count: attempts.count + 1, lastAttempt: now });
}

function clearAttempts(ip: string) {
    loginAttempts.delete(ip);
}

export async function POST(request: Request) {
    try {
        const ip = getClientIP(request);

        // Rate limit kontrolü
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Çok fazla başarısız giriş denemesi. 15 dakika bekleyin.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { email, password } = body;

        // Input validasyon
        if (!email || !password) {
            return NextResponse.json({ error: 'E-posta ve şifre gereklidir.' }, { status: 400 });
        }
        if (typeof email !== 'string' || typeof password !== 'string') {
            return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
        }
        if (email.length > 254 || password.length > 128) {
            return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
        }

        let user: any = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            include: { tenant: true }
        });

        let isSuperAdmin = false;

        if (!user) {
            const superAdmin = await prisma.superAdmin.findUnique({
                where: { email: email.toLowerCase().trim() }
            });
            if (superAdmin) {
                user = { ...superAdmin, role: 'SUPER_ADMIN', tenant: { status: 'ACTIVE' } };
                isSuperAdmin = true;
            } else {
                // Genel hata — hangi alanın yanlış olduğunu söyleme
                recordFailedAttempt(ip);
                return NextResponse.json({ error: 'E-posta veya şifre hatalı.' }, { status: 401 });
            }
        }

        // Plain text şifre karşılaştırmasını KAPAT — sadece hashlenmiş şifreler
        const storedPassword: string = user.password ?? '';
        if (!storedPassword.includes(':')) {
            // Plain text şifre bulundu — güvensiz, reddet ve logla
            console.error(`[SECURITY] Plain text password detected for user: ${user.email}`);
            recordFailedAttempt(ip);
            return NextResponse.json({ error: 'Hesap güvenlik güncellemesi gerekiyor. Destek ekibiyle iletişime geçin.' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, storedPassword);

        if (!isValid) {
            recordFailedAttempt(ip);
            return NextResponse.json({ error: 'E-posta veya şifre hatalı.' }, { status: 401 });
        }

        // SHA-256 → PBKDF2 otomatik yükseltme (geriye dönük uyumluluk)
        if (!storedPassword.startsWith('pbkdf2:')) {
            const newHash = await hashPassword(password);
            if (isSuperAdmin) {
                await prisma.superAdmin.update({ where: { id: user.id }, data: { password: newHash } }).catch(() => { });
            } else {
                await prisma.user.update({ where: { id: user.id }, data: { password: newHash } }).catch(() => { });
            }
        }

        // Tenant durum kontrolü
        if (!isSuperAdmin && user.tenant?.status !== 'ACTIVE' && user.tenant?.status !== 'TRIAL') {
            return NextResponse.json({ error: 'Hesabınız aktif değil. Destek ekibiyle iletişime geçin.' }, { status: 403 });
        }

        // Session oluştur
        const session = await createSession(user.id);
        clearAttempts(ip); // Başarılı giriş → deneme sayacını sıfırla

        const response = NextResponse.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

        response.cookies.set('auth-token', session.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;

    } catch (error: any) {
        // Özellikle veritabanı bağlantı hataları (Prisma) burada yakalanır
        console.error('--- CRITICAL REASON FOR JSON ERROR ---');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('-------------------------------------');

        return new Response(JSON.stringify({
            error: 'Veritabanı bağlantı hatası veya sunucu hatası oluştu.',
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
