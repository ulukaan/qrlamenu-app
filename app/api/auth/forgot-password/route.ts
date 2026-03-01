import { NextResponse } from 'next/server';
import crypto from 'crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendPasswordResetLinkEmail, sendPasswordResetEmail } from '@/lib/mail';

const RESET_LINK_VALIDITY_HOURS = 1;

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

        // Güvenlik: kayıtlı olmayan adres için de aynı mesajı dön
        if (!user) {
            console.log('[forgot-password] Kullanıcı bulunamadı:', email);
            return NextResponse.json({
                success: true,
                message: 'Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
            }, { status: 200 });
        }

        const restaurantName = user.tenant?.name ?? 'Restoran';
        const now = new Date();

        // --- Birincil akış: Link tabanlı şifre sıfırlama ---
        // DB'de yeni kolonlar varsa bu blok çalışır.
        try {
            type ResetData = { passwordResetToken: string; passwordResetTokenExpires: Date; lastPasswordResetRequestAt: Date };
            const resetData: ResetData = {
                passwordResetToken: crypto.randomBytes(32).toString('hex'),
                passwordResetTokenExpires: new Date(now.getTime() + RESET_LINK_VALIDITY_HOURS * 60 * 60 * 1000),
                lastPasswordResetRequestAt: now,
            };
            await prisma.user.update({
                where: { id: user.id },
                data: resetData as Prisma.UserUpdateInput,
            });

            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrlamenu.com';
            const resetLink = `${baseUrl}/sifre-sifirla?token=${resetData.passwordResetToken}`;
            console.log('[forgot-password] Link e-postası gönderiliyor:', user.email);
            const result = await sendPasswordResetLinkEmail(user.email, resetLink, restaurantName);

            if (result.success) {
                return NextResponse.json({
                    success: true,
                    message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Link 1 saat geçerlidir.',
                }, { status: 200 });
            }
            console.error('[forgot-password] Link maili SMTP hatası:', result.error);
        } catch (linkErr) {
            // Kolon yoksa (DB şeması eski) veya başka hata — fallback'e geç
            console.warn('[forgot-password] Link akışı başarısız, fallback devreye giriyor:', linkErr instanceof Error ? linkErr.message : linkErr);
        }

        // --- Fallback akış: Geçici şifre ile sıfırlama ---
        // DB'de yeni kolonlar olmasa bile çalışır (yalnızca password güncellenir).
        console.log('[forgot-password] Geçici şifre ile fallback:', user.email);
        const tempPassword = generateTemporaryPassword();
        await prisma.user.update({
            where: { id: user.id },
            data: { password: await hashPassword(tempPassword) },
        });

        const result = await sendPasswordResetEmail(user.email, tempPassword, restaurantName);
        if (!result.success) {
            console.error('[forgot-password] Fallback SMTP hatası:', result.error instanceof Error ? result.error.message : result.error);
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
        console.error('[forgot-password] Beklenmeyen hata:', error instanceof Error ? error.message : error);
        return NextResponse.json(
            { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
            { status: 500 }
        );
    }
}
