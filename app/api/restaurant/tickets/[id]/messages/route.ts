import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
        return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    const tenantId = (sessionUser as any).tenantId;
    if (!tenantId) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const { id } = params;

    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Mesaj boş olamaz' }, { status: 400 });
        }

        // Check if ticket belongs to tenant and is not closed
        const ticket = await prisma.supportTicket.findFirst({
            where: {
                id,
                tenantId
            }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Bilet bulunamadı' }, { status: 404 });
        }

        if (ticket.status === 'CLOSED') {
            return NextResponse.json({ error: 'Kalıcı olarak kapatılmış biletlere mesaj gönderilemez' }, { status: 400 });
        }

        const newMessage = await prisma.ticketMessage.create({
            data: {
                message,
                ticketId: id,
                isAdmin: false
            }
        });

        // Update ticket's updatedAt timestamp
        await prisma.supportTicket.update({
            where: { id },
            data: { updatedAt: new Date() }
        });

        // Trigger Pusher event for real-time admin notification
        const { triggerEvent } = await import('@/lib/pusher');
        await triggerEvent('admin-tickets', 'new-message', {
            ticketId: id,
            message: newMessage
        });

        // Trigger count update for admin sidebar
        await triggerEvent('admin-notifications', 'update-count', {});

        return NextResponse.json(newMessage);
    } catch (error: any) {
        console.error('Ticket Message Creation Error:', error);
        return NextResponse.json({ error: 'Mesaj gönderilemedi' }, { status: 500 });
    }
}
