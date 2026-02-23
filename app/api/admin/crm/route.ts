import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // @ts-ignore - Prisma might be regenerating
        const leads = await prisma.lead.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error('Fetch Leads Error:', error);
        return NextResponse.json({ error: 'CRM verileri alınamadı.' }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, restaurant, email, phone, notes } = body;

        if (!name) return NextResponse.json({ error: 'İsim gerekli' }, { status: 400 });

        const lead = await prisma.lead.create({
            data: {
                name,
                restaurant,
                email,
                phone,
                notes,
                status: 'PENDING'
            }
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Create Lead Error:', error);
        return NextResponse.json({ error: 'Lead oluşturulamadı.' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

        const updated = await prisma.lead.update({
            where: { id },
            data
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update Lead Error:', error);
        return NextResponse.json({ error: 'Güncelleme yapılamadı.' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

        await prisma.lead.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Lead Error:', error);
        return NextResponse.json({ error: 'Silme işlemi başarısız.' }, { status: 500 });
    }
}
