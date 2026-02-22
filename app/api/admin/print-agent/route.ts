import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const agents = await prisma.printAgent.findMany({
            include: {
                tenant: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                lastSeen: 'desc'
            }
        });

        return NextResponse.json(agents);
    } catch (error) {
        console.error('Fetch Print Agents Error:', error);
        return NextResponse.json({ error: 'Yazıcı servisleri alınamadı.' }, { status: 500 });
    }
}
