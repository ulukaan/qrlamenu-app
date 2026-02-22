import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const getTenantId = (req: Request) => {
    const { searchParams } = new URL(req.url);
    return searchParams.get('tenantId') || 'default_tenant_id';
};

export async function GET(request: Request) {
    const tenantId = getTenantId(request);

    try {
        const [orderCount, categoryCount, pendingOrders] = await Promise.all([
            prisma.order.count({ where: { tenantId } }),
            prisma.category.count({ where: { tenantId } }),
            prisma.order.count({ where: { tenantId, status: 'PENDING' } })
        ]);

        // Generate some realistic-looking mock data for the last 7 days
        const mockMonthlyScans = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                name: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
                scans: Math.floor(Math.random() * 50) + 10,
                orders: Math.floor(Math.random() * 20) + 5
            };
        });

        return NextResponse.json({
            orderCount,
            categoryCount,
            pendingOrders,
            scanCount: mockMonthlyScans.reduce((sum, day) => sum + day.scans, 0),
            monthlyScans: mockMonthlyScans
        });
    } catch (error) {
        return NextResponse.json({ error: 'İstatistikler alınamadı' }, { status: 500 });
    }
}
