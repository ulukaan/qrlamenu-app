import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const getTenantId = (req: Request) => {
    const { searchParams } = new URL(req.url);
    return searchParams.get('tenantId') || 'default_tenant_id';
};

export async function GET(request: Request) {
    const tenantId = getTenantId(request);

    try {
        const [categoryCount, pendingOrders] = await Promise.all([
            prisma.category.count({ where: { tenantId } }),
            prisma.order.count({ where: { tenantId, status: 'PENDING' } })
        ]);

        // Son 7 günün istatistiklerini DailyStat'tan hesapla (Gerçek Veri)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);
        startDate.setUTCHours(0, 0, 0, 0);

        const dailyStats = await prisma.dailyStat.findMany({
            where: {
                tenantId,
                date: { gte: startDate }
            },
            orderBy: { date: 'asc' }
        });

        // Tüm zamanların sipariş sayısını getirme (Eskiden Order'ların sayımıydı)
        const totalStatInfo = await prisma.dailyStat.aggregate({
            where: { tenantId },
            _sum: {
                orderCount: true,
                totalRevenue: true
            }
        });

        // DailyStat verisini Recharts'in istediği formata (gün bazlı) doldur/matchle
        const monthlyScans = Array.from({ length: 7 }).map((_, i) => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - (6 - i));
            currentDate.setUTCHours(0, 0, 0, 0);

            const statMatch = dailyStats.find(d =>
                new Date(d.date).setUTCHours(0, 0, 0, 0) === currentDate.getTime()
            );

            return {
                name: currentDate.toLocaleDateString('tr-TR', { weekday: 'short' }),
                scans: statMatch ? statMatch.orderCount : 0, // QR Okunmaları geçici olarak ciro ile simüle edebilirsiniz veya scan sayaçları olursa eklersiniz.
                orders: statMatch ? statMatch.orderCount : 0,
                revenue: statMatch ? statMatch.totalRevenue : 0
            };
        });

        return NextResponse.json({
            orderCount: totalStatInfo._sum.orderCount || 0,
            totalRevenue: totalStatInfo._sum.totalRevenue || 0,
            categoryCount,
            pendingOrders,
            scanCount: totalStatInfo._sum.orderCount || 0, // Geçici
            monthlyScans: monthlyScans
        });
    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ error: 'İstatistikler alınamadı' }, { status: 500 });
    }
}
