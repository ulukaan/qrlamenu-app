import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';
import { triggerEvent } from '@/lib/pusher';

export async function GET() {
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

    try {
        // @ts-ignore
        const tickets = await prisma.supportTicket.findMany({
            where: { tenantId },
            include: {
                _count: {
                    select: { messages: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(tickets);
    } catch (error: any) {
        console.error('Tickets Fetch Error:', error);
        return NextResponse.json({ error: 'Biletler yüklenemedi' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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

    try {
        const body = await request.json();
        const { subject, category, priority, message } = body;

        if (!subject || !message) {
            return NextResponse.json({ error: 'Konu ve mesaj gereklidir' }, { status: 400 });
        }

        // Create the ticket and the first message in a transaction
        const ticket = await prisma.$transaction(async (tx) => {
            // @ts-ignore
            const newTicket = await tx.supportTicket.create({
                data: {
                    subject,
                    category: category || 'GENERAL',
                    priority: priority || 'MEDIUM',
                    tenantId,
                    messages: {
                        create: {
                            message,
                            isAdmin: false
                        }
                    }
                },
                include: {
                    messages: true
                }
            });
            return newTicket;
        });


        // Trigger Pusher event for real-time admin notification
        await triggerEvent('admin-notifications', 'new-ticket', {
            id: ticket.id,
            subject: ticket.subject,
            tenantName: (sessionUser as any).tenant?.name || 'Restoran'
        });

        return NextResponse.json(ticket);
    } catch (error: any) {
        console.error('Ticket Creation Error:', error);
        return NextResponse.json({ error: 'Bilet oluşturulamadı' }, { status: 500 });
    }
}
