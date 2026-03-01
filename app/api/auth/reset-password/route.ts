import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { validatePassword } from '@/lib/password-policy';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const token = typeof body?.token === 'string' ? body.token.trim() : '';
        const password = typeof body?.password === 'string' ? body.password : '';

        if (!token) {
            return NextResponse.json(
                { error: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen şifre sıfırlama talebini tekrarlayın.' },
                { status: 400 }
            );
        }

        const validation = validatePassword(password);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { passwordResetToken: token },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen şifre sıfırlama talebini tekrarlayın.' },
                { status: 400 }
            );
        }

        const now = new Date();
        if (!user.passwordResetTokenExpires || user.passwordResetTokenExpires < now) {
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordResetToken: null, passwordResetTokenExpires: null },
            });
            return NextResponse.json(
                { error: 'Şifre sıfırlama linkinin süresi dolmuş. Lütfen yeni bir talep oluşturun.' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetTokenExpires: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Şifreniz güncellendi. Giriş yapabilirsiniz.',
        }, { status: 200 });
    } catch (error) {
        console.error('Reset password hatası:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
            { status: 500 }
        );
    }
}
