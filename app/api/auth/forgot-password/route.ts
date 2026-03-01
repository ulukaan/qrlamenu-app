import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendPasswordResetLinkEmail, sendPasswordResetEmail } from '@/lib/mail';

const RESET_LINK_VALIDITY_HOURS = 1;

/** Okunaklı geçici şifre */
function generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const bytes = crypto.randomBytes(10);
    let result = '';
    for (let i = 0; i < 10; i++) result += chars[bytes[i]! % chars.length];
    return result;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Geçerli bir e-posta adresi girin.' },
                { status: 400 }
            );
        }

        // Sadece her zaman var olan alanları seç — yeni kolonlar DB'de yoksa bile bu sorgu patlamaz
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                tenantId: true,
                tenant: { select: { name: true } },
            },
        });

        if (!user) {
            console.log('[forgot-password] Kayıtlı kullanıcı bulunamadı:', email);
            return NextResponse.json({
                success: true,
                message: 'Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
            }, { status: 200 });
        }

        const restaurantName = user.tenant?.name ?? 'Restoran';

        // 1. Tercih: Link tabanlı sıfırlama (DB'de yeni kolonlar varsa)
        try {
            // Rate limit kontrolü — raw query ile, kolon yoksa hata verir ve fallback'e düşer
            const rateLimitRows = await prisma.$queryRawUnsafe<{ cnt: bigint }[]>(
                `SELECT COUNT(*) as cnt FROM "User" WHERE id = $1 AND "lastPasswordResetRequestAt" > NOW() - INTERVAL '1 hour'`,
                user.id
            );
            if (rateLimitRows.length > 0 && Number(rateLimitRows[0].cnt) > 0) {
                console.log('[forgot-password] Rate limit:', user.email);
                return NextResponse.json({
                    success: true,
                    message: 'Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
                }, { status: 200 });
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + RESET_LINK_VALIDITY_HOURS * 60 * 60 * 1000);

            // Raw update — kolon yoksa hata verir ve fallback'e geçer
            await prisma.$executeRawUnsafe(
                `UPDATE "User" SET "passwordResetToken" = $1, "passwordResetTokenExpires" = $2, "lastPasswordResetRequestAt" = NOW() WHERE id = $3`,
                token, expiresAt, user.id
            );

            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrlamenu.com';
            const resetLink = `${baseUrl}/sifre-sifirla?token=${token}`;

            console.log('[forgot-password] Link e-postası gönderiliyor:', user.email);
            const result = await sendPasswordResetLinkEmail(user.email, resetLink, restaurantName);

            if (!result.success) {
                const errMsg = result.error instanceof Error ? result.error.message : String(result.error);
                console.error('[forgot-password] SMTP hatası:', errMsg);
                return NextResponse.json(
                    { error: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin veya destek ile iletişime geçin.' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Link 1 saat geçerlidir.',
            }, { status: 200 });
        } catch (linkFlowError) {
            console.warn('[forgot-password] Link akışı başarısız (DB şeması?), geçici şifre fallback:', linkFlowError);
        }

        // 2. Fallback: Geçici şifre ile mail gönder (DB'de yeni kolonlar yoksa)
        const tempPassword = generateTemporaryPassword();
        const hashedPassword = await hashPassword(tempPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        console.log('[forgot-password] Geçici şifre e-postası gönderiliyor (fallback):', user.email);
        const result = await sendPasswordResetEmail(user.email, tempPassword, restaurantName);

        if (!result.success) {
            const errMsg = result.error instanceof Error ? result.error.message : String(result.error);
            console.error('[forgot-password] SMTP hatası (fallback):', errMsg);
            return NextResponse.json(
                { error: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin veya destek ile iletişime geçin.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Şifre sıfırlama bilgileri e-posta adresinize gönderildi. Gelen kutunuzu ve spam klasörünü kontrol edin.',
        }, { status: 200 });
    } catch (error) {
        console.error('[forgot-password] Hata:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
            { status: 500 }
        );
    }
}
