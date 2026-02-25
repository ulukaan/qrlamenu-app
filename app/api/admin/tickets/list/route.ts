import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser || (sessionUser as any).role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        // @ts-ignore
        const tickets = await prisma.supportTicket.findMany({
            include: {
                tenant: {
                    select: { name: true, slug: true, logoUrl: true }
                },
                _count: {
                    select: { messages: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(tickets);
    } catch (error: any) {
        console.error('Admin Tickets List Fetch Error:', error);
        return NextResponse.json({ error: 'Bilet listesi yüklenemedi' }, { status: 500 });
    }
}
