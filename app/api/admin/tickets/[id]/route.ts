import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
        // @ts-ignore
        const ticket = await prisma.supportTicket.findUnique({
            where: {
                id
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Bilet bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(ticket);
    } catch (error: any) {
        console.error('Admin Ticket Fetch Error:', error);
        return NextResponse.json({ error: 'Bilet yüklenemedi' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
        // @ts-ignore
        await prisma.supportTicket.delete({
            where: {
                id
            }
        });

        return NextResponse.json({ success: true, message: 'Bilet başarıyla silindi' });
    } catch (error: any) {
        console.error('Admin Ticket Delete Error:', error);
        return NextResponse.json({ error: 'Bilet silinemedi' }, { status: 500 });
    }
}

