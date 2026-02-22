import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/login?error=MissingToken', req.url));
        }

        const now = new Date();

        // Check if token belongs to a User
        let userOrAdmin = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        let isSuperAdmin = false;

        // If not a user, check SuperAdmin
        if (!userOrAdmin) {
            const admin = await prisma.superAdmin.findUnique({
                where: { verificationToken: token }
            });
            if (admin) {
                userOrAdmin = admin as any;
                isSuperAdmin = true;
            }
        }

        if (!userOrAdmin) {
            // Token not found
            return NextResponse.redirect(new URL('/dashboard?error=InvalidToken', req.url));
        }

        // Check token expiry
        if (
            !userOrAdmin.verificationTokenExpires ||
            new Date(userOrAdmin.verificationTokenExpires) < now
        ) {
            return NextResponse.redirect(new URL('/dashboard?error=TokenExpired', req.url));
        }

        // Mark as verified and remove token
        if (isSuperAdmin) {
            await prisma.superAdmin.update({
                where: { id: userOrAdmin.id },
                data: {
                    emailVerified: now,
                    verificationToken: null,
                    verificationTokenExpires: null
                }
            });
        } else {
            await prisma.user.update({
                where: { id: userOrAdmin.id },
                data: {
                    emailVerified: now,
                    verificationToken: null,
                    verificationTokenExpires: null
                }
            });
        }

        // Successfully verified, redirect to dashboard with success param
        return NextResponse.redirect(new URL('/dashboard?success=EmailVerified', req.url));

    } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.redirect(new URL('/dashboard?error=VerificationFailed', req.url));
    }
}
