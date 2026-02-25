import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ count: 0 });
    }

    const sessionUser = await validateSession(token);
    const isSuperAdmin = sessionUser && ((sessionUser as any).role === 'SUPER_ADMIN' || (sessionUser as any).superAdminId);

    if (!isSuperAdmin) {
        return NextResponse.json({ count: 0 });
    }

    try {
        // Count total active tenants as a badge indicator
        const count = await prisma.tenant.count({
            where: {
                status: 'ACTIVE'
            }
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Admin Tenants Count Error:', error);
        return NextResponse.json({ count: 0 });
    }
}
