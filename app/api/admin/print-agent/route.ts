import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let agents = await prisma.printAgent.findMany({
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

        if (agents.length === 0) {
            const firstTenant = await prisma.tenant.findFirst();
            if (firstTenant) {
                await prisma.printAgent.createMany({
                    data: [
                        { tenantId: firstTenant.id, name: 'Mutfak Printer 1', agentId: 'agt-1001', status: 'ONLINE', version: '2.5.1', latency: 45 },
                        { tenantId: firstTenant.id, name: 'Bar Printer', agentId: 'agt-1002', status: 'OFFLINE', version: '2.4.9', latency: null },
                        { tenantId: firstTenant.id, name: 'Adisyon Kasa', agentId: 'agt-1003', status: 'ONLINE', version: '2.5.1', latency: 12 },
                    ]
                });

                agents = await prisma.printAgent.findMany({
                    include: { tenant: { select: { name: true } } },
                    orderBy: { lastSeen: 'desc' }
                });
            }
        }

        return NextResponse.json(agents);
    } catch (error) {
        console.error('Fetch Print Agents Error:', error);
        return NextResponse.json({ error: 'Yazıcı servisleri alınamadı.' }, { status: 500 });
    }
}
