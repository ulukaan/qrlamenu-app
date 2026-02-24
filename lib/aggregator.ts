import { prisma } from '@/lib/prisma';

export async function aggregateOrderStat(
    tenantId: string,
    amount: number,
    previousStatus: string,
    newStatus: string
) {
    // Determine delta changes
    let revenueDelta = 0;
    let orderDelta = 0;

    // Transition from Not Completed to Completed
    if (newStatus === 'COMPLETED' && previousStatus !== 'COMPLETED') {
        revenueDelta = amount;
        orderDelta = 1;
    }
    // Transition from Completed to Not Completed (e.g. Cancelled / Reverted)
    else if (previousStatus === 'COMPLETED' && newStatus !== 'COMPLETED') {
        revenueDelta = -amount;
        orderDelta = -1;
    }

    // Eğer ciro veya satılan sipariş rakamında değişim yoksa DB yorma
    if (revenueDelta === 0 && orderDelta === 0) return;

    // Get today's date (Start of Day in UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Upsert DailyStat record
    try {
        await prisma.dailyStat.upsert({
            where: {
                tenantId_date: {
                    tenantId: tenantId,
                    date: today
                }
            },
            update: {
                totalRevenue: { increment: revenueDelta },
                orderCount: { increment: orderDelta }
            },
            create: {
                tenantId,
                date: today,
                totalRevenue: revenueDelta > 0 ? revenueDelta : 0,
                orderCount: orderDelta > 0 ? orderDelta : 0
            }
        });
    } catch (error) {
        console.error('Data Aggregation Failed:', error);
    }
}
