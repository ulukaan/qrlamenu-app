import { NextResponse } from 'next/server';
import crypto from 'crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendPasswordResetLinkEmail, sendPasswordResetEmail } from '@/lib/mail';

const RESET_LINK_VALIDITY_HOURS = 1;
const RATE_LIMIT_HOURS = 1;

/** Şema güncelken Prisma client tipleri gecikmeli güncellenebildiği için update verisi için tip. */
type UserResetFields = {
    passwordResetToken: string;
    passwordResetTokenExpires: Date;
    lastPasswordResetRequestAt: Date;
};

function isSchemaError(error: unknown): boolean {
    const msg = error instanceof Error ? error.message : String(error);
    return (
        /Unknown arg|Unknown field/i.test(msg) ||
        /passwordResetToken|lastPasswordResetRequestAt/i.test(msg) ||
        /column.*does not exist|no such column/i.test(msg)
    );
}

/** Okunaklı geçici şifre (fallback için) */
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

        const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true },
        });

        if (!user) {
            console.log('[forgot-password] Kayıtlı kullanıcı bulunamadı:', email);
            return NextResponse.json({
                success: true,
                message: 'Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
            }, { status: 200 });
        }

        const now = new Date();
        const rateLimitSince = new Date(now.getTime() - RATE_LIMIT_HOURS * 60 * 60 * 1000);
        const lastRequest = (user as unknown as { lastPasswordResetRequestAt?: Date | null }).lastPasswordResetRequestAt;
        if (lastRequest && lastRequest > rateLimitSince) {
            console.log('[forgot-password] Rate limit:', user.email);
            return NextResponse.json({
                success: true,
                message: 'Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
            }, { status: 200 });
        }

        const restaurantName = user.tenant?.name ?? 'Restoran';

        try {
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(now.getTime() + RESET_LINK_VALIDITY_HOURS * 60 * 60 * 1000);
            const updateData: UserResetFields = {
                passwordResetToken: token,
                passwordResetTokenExpires: expiresAt,
                lastPasswordResetRequestAt: now,
            };
            await prisma.user.update({
                where: { id: user.id },
                data: updateData as Prisma.UserUpdateInput,
            });

            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrlamenu.com';
            const resetLink = `${baseUrl}/sifre-sifirla?token=${token}`;
            console.log('[forgot-password] E-posta gönderiliyor (link):', user.email);
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
                message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Link 1 saat geçerlidir. Gelen kutunuzu ve spam klasörünü kontrol edin.',
            }, { status: 200 });
        } catch (linkFlowError) {
            if (!isSchemaError(linkFlowError)) throw linkFlowError;
            console.warn('[forgot-password] Link akışı başarısız (DB şeması?), geçici şifre ile fallback:', linkFlowError);
        }

        // Fallback: DB'de yeni kolonlar yoksa geçici şifre ile mail gönder (500 önlenir)
        const tempPassword = generateTemporaryPassword();
        const hashedPassword = await hashPassword(tempPassword);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        console.log('[forgot-password] E-posta gönderiliyor (geçici şifre fallback):', user.email);
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
            message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Gelen kutunuzu ve spam klasörünü kontrol edin.',
        }, { status: 200 });
    } catch (error) {
        console.error('[forgot-password] Hata:', error);
        // Veritabanında passwordResetToken / lastPasswordResetRequestAt kolonları yoksa Prisma hata verir → production'da npx prisma db push çalıştırın
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes('Unknown arg') || msg.includes('passwordResetToken') || msg.includes('column')) {
            console.error('[forgot-password] Olası sebep: DB şeması güncel değil. Production\'da prisma db push veya migrate çalıştırın.');
        }
        return NextResponse.json(
            { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
            { status: 500 }
        );
    }
}
