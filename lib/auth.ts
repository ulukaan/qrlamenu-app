import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';

// --- Hash Fonksiyonları ---
// PBKDF2 ile güvenli şifre hashleme (SHA-256 yerine)
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(32).toString('hex');
    const hash = pbkdf2Sync(password, salt, 310_000, 64, 'sha512').toString('hex');
    return `pbkdf2:sha512:310000:${salt}:${hash}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
        // Yeni format: pbkdf2:sha512:iterations:salt:hash
        if (storedHash.startsWith('pbkdf2:')) {
            const parts = storedHash.split(':');
            if (parts.length !== 5) return false;
            const [, , iterStr, salt, hash] = parts;
            const iterations = parseInt(iterStr, 10);
            const inputHash = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
            // Timing-safe karşılaştırma (timing attack'a karşı)
            return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(inputHash, 'hex'));
        }

        // Eski format: salt:sha256hash — geriye dönük uyumluluk
        if (storedHash.includes(':')) {
            const [salt, hash] = storedHash.split(':');
            if (!salt || !hash) return false;
            const { createHash } = await import('crypto');
            const verifyHash = createHash('sha256').update(password + salt).digest('hex');
            return hash === verifyHash;
        }

        // Plain text — hiçbir zaman geçerli sayma (güvenlik)
        return false;
    } catch {
        return false;
    }
}

// --- Session Fonksiyonları ---
export async function createSession(userId: string) {
    const token = randomBytes(48).toString('hex'); // 48 → daha uzun, tahmin edilemez
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Süresi dolmuş session'ları temizle (arka planda)
    prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => { });

    const superAdmin = userId ? await prisma.superAdmin.findUnique({ where: { id: userId } }).catch(() => null) : null;

    if (superAdmin) {
        return await prisma.session.create({ data: { token, superAdminId: userId, expiresAt } });
    }

    return await prisma.session.create({ data: { token, userId, expiresAt } });
}

export async function validateSession(token: string) {
    if (!token || token.length < 32) return null; // Kısa token'ları reddet

    const session = await prisma.session.findUnique({
        where: { token },
        include: {
            user: { include: { tenant: true } },
            superAdmin: true
        }
    });

    if (!session || session.expiresAt < new Date()) {
        if (session) {
            // Süresi dolmuş session'ı sil
            prisma.session.delete({ where: { token } }).catch(() => { });
        }
        return null;
    }

    if (session.superAdmin) {
        return {
            ...session.superAdmin,
            role: 'SUPER_ADMIN',
            tenant: { status: 'ACTIVE', name: 'System' }
        };
    }

    if (session.user) {
        return session.user;
    }

    return null;
}

export async function destroySession(token: string) {
    await prisma.session.delete({ where: { token } }).catch(() => { });
}

/** 
 * Rol bazlı yetkilendirme yardımcıları
 */
export function isSuperAdmin(session: any): boolean {
    return session && session.role === 'SUPER_ADMIN';
}

export function isRestaurantAdmin(session: any): boolean {
    return session && session.role === 'ADMIN';
}

export function hasRole(session: any, roles: string[]): boolean {
    return session && roles.includes(session.role);
}
