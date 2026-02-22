import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const payments = await prisma.transaction.findMany({
            include: {
                tenant: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error('Fetch Payments Error:', error);
        return NextResponse.json({ error: 'Ödemeler alınamadı.' }, { status: 500 });
    }
}
