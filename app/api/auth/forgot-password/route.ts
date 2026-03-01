import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetLinkEmail } from '@/lib/mail';

const RESET_LINK_VALIDITY_HOURS = 1;
const RATE_LIMIT_HOURS = 1;

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
        if (user.lastPasswordResetRequestAt && user.lastPasswordResetRequestAt > rateLimitSince) {
            console.log('[forgot-password] Rate limit:', user.email);
            return NextResponse.json({
                success: true,
                message: 'Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
            }, { status: 200 });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(now.getTime() + RESET_LINK_VALIDITY_HOURS * 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: token,
                passwordResetTokenExpires: expiresAt,
                lastPasswordResetRequestAt: now,
            },
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrlamenu.com';
        const resetLink = `${baseUrl}/sifre-sifirla?token=${token}`;
        const restaurantName = user.tenant?.name ?? 'Restoran';

        console.log('[forgot-password] E-posta gönderiliyor:', user.email);
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
    } catch (error) {
        console.error('Şifremi unuttum hatası:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
            { status: 500 }
        );
    }
}
