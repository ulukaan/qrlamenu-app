import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
        }

        const userOrAdmin = await validateSession(token);
        if (!userOrAdmin) {
            return NextResponse.json({ error: "Kullanıcı bilgileri eksik" }, { status: 401 });
        }

        const isSuperAdmin = (userOrAdmin as any).role === 'SUPER_ADMIN';

        if (userOrAdmin.emailVerified) {
            return NextResponse.json({ error: "E-posta adresi zaten doğrulanmış" }, { status: 400 });
        }

        // Generate a random token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Set expiry to 24 hours from now
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        if (isSuperAdmin) {
            await prisma.superAdmin.update({
                where: { id: userOrAdmin.id },
                data: {
                    verificationToken,
                    verificationTokenExpires: expiresAt
                }
            });
        } else {
            await prisma.user.update({
                where: { id: userOrAdmin.id },
                data: {
                    verificationToken,
                    verificationTokenExpires: expiresAt
                }
            });
        }

        const result = await sendVerificationEmail(userOrAdmin.email, verificationToken);

        if (!result.success) {
            console.error("Doğrulama e-postası gönderilemedi:", result.error);
            return NextResponse.json(
                { error: "E-posta gönderilemedi. SMTP ayarlarını kontrol edin veya daha sonra tekrar deneyin." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Doğrulama e-postası başarıyla gönderildi. Gelen kutunuzu ve spam klasörünü kontrol edin."
        }, { status: 200 });

    } catch (error) {
        console.error("Verification Email Send Error:", error);
        return NextResponse.json({ error: "E-posta gönderilemedi" }, { status: 500 });
    }
}
