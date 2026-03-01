import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/mail';

/** Güvenli rastgele şifre üretir (okunaklı karakterler, 12 karakter) */
function generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const bytes = crypto.randomBytes(12);
    let result = '';
    for (let i = 0; i < 12; i++) result += chars[bytes[i]! % chars.length];
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

        // Sadece restoran kullanıcıları (User) — SuperAdmin şifremi unuttum ayrı akışta
        const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true },
        });

        // Güvenlik: E-posta bulunamasa bile aynı mesajı dön (kullanıcı enumeration engeli)
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
            }, { status: 200 });
        }

        const temporaryPassword = generateTemporaryPassword();
        const hashedPassword = await hashPassword(temporaryPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        const restaurantName = user.tenant?.name ?? 'Restoran';
        const result = await sendPasswordResetEmail(user.email, temporaryPassword, restaurantName);

        if (!result.success) {
            console.error('Şifremi unuttum e-postası gönderilemedi:', result.error);
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
        console.error('Şifremi unuttum hatası:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
            { status: 500 }
        );
    }
}
