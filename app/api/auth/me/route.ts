import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
        where: { token },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true, tenantId: true, emailVerified: true },
            },
            superAdmin: {
                select: { id: true, name: true, email: true, role: true, emailVerified: true }
            }
        }
    });

    if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    if (session.superAdmin) {
        return NextResponse.json({
            user: {
                ...session.superAdmin,
                role: 'SUPER_ADMIN',
                // Super Admins don't have a tenant, but we can pass a dummy one or null
                tenantId: null
            }
        });
    }

    return NextResponse.json({ user: session.user });
}
