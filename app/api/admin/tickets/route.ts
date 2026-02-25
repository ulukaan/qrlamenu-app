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

        console.log(`[AdminAPI] Fetched ${tickets.length} tickets for admin.`);
        return NextResponse.json(tickets);
    } catch (error: any) {
        console.error('Admin Tickets Fetch Error:', error);
        return NextResponse.json({ error: 'Biletler yüklenemedi' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
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
        const body = await request.json();
        const { id, status, priority } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID gereklidir' }, { status: 400 });
        }

        const updatedTicket = await prisma.supportTicket.update({
            where: { id },
            data: {
                status: status || undefined,
                priority: priority || undefined
            }
        });

        return NextResponse.json(updatedTicket);
    } catch (error: any) {
        console.error('Admin Ticket Update Error:', error);
        return NextResponse.json({ error: 'Bilet güncellenemedi' }, { status: 500 });
    }
}
