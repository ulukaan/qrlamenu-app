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

        const sessionResult = await validateSession(token);

        // validateSession usually returns `any` but we know it has user or superAdmin properties
        let userOrAdmin = null;
        let isSuperAdmin = false;

        if ((sessionResult as any).superAdmin) {
            userOrAdmin = (sessionResult as any).superAdmin;
            isSuperAdmin = true;
        } else if ((sessionResult as any).user) {
            userOrAdmin = (sessionResult as any).user;
        }

        if (!userOrAdmin) {
            return NextResponse.json({ error: "Kullanıcı bilgileri eksik" }, { status: 401 });
        }

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

        // Send Email via our Ethereal Mail utility
        const result = await sendVerificationEmail(userOrAdmin.email, verificationToken);

        return NextResponse.json({
            success: true,
            message: "Doğrulama e-postası başarıyla gönderildi"
        }, { status: 200 });

    } catch (error) {
        console.error("Verification Email Send Error:", error);
        return NextResponse.json({ error: "E-posta gönderilemedi" }, { status: 500 });
    }
}
