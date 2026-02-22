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
