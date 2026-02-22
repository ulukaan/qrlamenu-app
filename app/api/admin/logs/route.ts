import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // @ts-ignore - Prisma might be regenerating
        const logs = await prisma.systemLog.findMany({
            take: 50,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Fetch Logs Error:', error);
        return NextResponse.json({ error: 'Sistem logları alınamadı.' }, { status: 500 });
    }
}
