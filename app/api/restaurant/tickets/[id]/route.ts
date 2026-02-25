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
    if (!sessionUser) {
        return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    const tenantId = (sessionUser as any).tenantId;
    if (!tenantId) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const { id } = params;

    try {
        // @ts-ignore
        const ticket = await prisma.supportTicket.findFirst({
            where: {
                id,
                tenantId
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
        console.error('Ticket Fetch Error:', error);
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
    if (!sessionUser) {
        return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    const tenantId = (sessionUser as any).tenantId;
    if (!tenantId) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const { id } = params;

    try {
        // First check if ticket belongs to tenant
        // @ts-ignore
        const ticket = await prisma.supportTicket.findFirst({
            where: {
                id,
                tenantId
            }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Bilet bulunamadı veya silme yetkiniz yok' }, { status: 404 });
        }

        // @ts-ignore
        await prisma.supportTicket.delete({
            where: {
                id
            }
        });

        return NextResponse.json({ success: true, message: 'Bilet başarıyla silindi' });
    } catch (error: any) {
        console.error('Ticket Delete Error:', error);
        return NextResponse.json({ error: 'Bilet silinemedi' }, { status: 500 });
    }
}

