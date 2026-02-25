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
    if (!sessionUser) {
        return NextResponse.json({ count: 0 });
    }

    const tenantId = (sessionUser as any).tenantId;
    if (!tenantId) {
        return NextResponse.json({ count: 0 });
    }

    try {
        // Count pending orders
        const pendingOrdersCount = await prisma.order.count({
            where: {
                tenantId,
                status: 'PENDING'
            }
        });

        // Count pending waiter calls
        const pendingWaiterCallsCount = await prisma.waiterCall.count({
            where: {
                tenantId,
                status: 'PENDING'
            }
        });

        const totalCount = pendingOrdersCount + pendingWaiterCallsCount;

        return NextResponse.json({ count: totalCount });
    } catch (error) {
        console.error('Restaurant Orders Count Error:', error);
        return NextResponse.json({ count: 0 });
    }
}
