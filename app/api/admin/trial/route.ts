import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const trials = await prisma.tenant.findMany({
            where: {
                status: 'TRIAL'
            },
            include: {
                plan: true
            },
            orderBy: {
                trialExpiresAt: 'asc'
            }
        });

        return NextResponse.json(trials);
    } catch (error) {
        console.error('Fetch Trials Error:', error);
        return NextResponse.json({ error: 'Trial verileri alınamadı.' }, { status: 500 });
    }
}
