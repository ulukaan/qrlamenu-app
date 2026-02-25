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
    if (!sessionUser || (sessionUser as any).role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;

    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Mesaj boş olamaz' }, { status: 400 });
        }

        // @ts-ignore
        const newMessage = await prisma.ticketMessage.create({
            data: {
                message,
                ticketId: id,
                isAdmin: true,
                adminId: (sessionUser as any).id
            }
        });

        // Automatically set ticket to IN_PROGRESS when admin replies
        // @ts-ignore
        const updatedTicket = await prisma.supportTicket.update({
            where: { id },
            data: {
                status: 'IN_PROGRESS',
                updatedAt: new Date()
            },
            include: { tenant: true }
        });

        // Trigger Pusher event for real-time restaurant notification
        const { triggerRestaurantEvent, triggerEvent } = await import('@/lib/pusher');
        await triggerRestaurantEvent(updatedTicket.tenantId, 'new-message', {
            ticketId: id,
            message: newMessage
        });

        // Trigger count update for restaurant sidebar
        await triggerRestaurantEvent(updatedTicket.tenantId, 'update-count', {});

        return NextResponse.json(newMessage);
    } catch (error: any) {
        console.error('Admin Ticket Message Error:', error);
        return NextResponse.json({ error: 'Mesaj gönderilemedi' }, { status: 500 });
    }
}
