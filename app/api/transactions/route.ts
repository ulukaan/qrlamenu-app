import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session: any = await validateSession(token);
        if (!session?.tenant?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch transactions for the current user's tenant
        const transactions = await prisma.transaction.findMany({
            where: { tenantId: session.tenant.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Transactions GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}
