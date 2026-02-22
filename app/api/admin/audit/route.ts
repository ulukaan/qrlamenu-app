import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const auditLogs = await prisma.auditLog.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 100
        });

        return NextResponse.json(auditLogs);
    } catch (error) {
        console.error('Fetch Audit Logs Error:', error);
        return NextResponse.json({ error: 'Denetim kayıtları alınamadı.' }, { status: 500 });
    }
}
