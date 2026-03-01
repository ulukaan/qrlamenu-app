import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        const loginUrl = new URL('/login', req.url);

        if (!token) {
            loginUrl.searchParams.set('error', 'MissingToken');
            return NextResponse.redirect(loginUrl);
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
            loginUrl.searchParams.set('error', 'InvalidToken');
            return NextResponse.redirect(loginUrl);
        }

        if (
            !userOrAdmin.verificationTokenExpires ||
            new Date(userOrAdmin.verificationTokenExpires) < now
        ) {
            loginUrl.searchParams.set('error', 'TokenExpired');
            return NextResponse.redirect(loginUrl);
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

        loginUrl.searchParams.set('verified', '1');
        return NextResponse.redirect(loginUrl);
    } catch (error) {
        console.error("Token verification error:", error);
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('error', 'VerificationFailed');
        return NextResponse.redirect(loginUrl);
    }
}
