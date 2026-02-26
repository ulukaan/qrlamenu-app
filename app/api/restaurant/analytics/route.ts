import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession, isRestaurantAdmin } from '@/lib/auth';

export async function GET(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // RBAC: Sadece Admin analitiği görebilir
    if (!isRestaurantAdmin(sessionUser)) {
        return NextResponse.json({ error: 'Bu işlem için Admin yetkisi gereklidir' }, { status: 403 });
    }

    const tenantId = (sessionUser as any).tenantId;

    try {
        // Fetch orders from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await (prisma as any).order.findMany({
            where: {
                tenantId,
                createdAt: {
                    gte: thirtyDaysAgo
                }
            },
            orderBy: { createdAt: 'desc' } // Descending for recent orders list
        });

        // Initialize Stats
        let totalRevenue = 0;
        let completedOrders = 0;
        let activeOrders = 0; // PENDING, PREPARING
        const productStats: Record<string, { name: string, quantity: number, revenue: number }> = {};
        const dailyRevenue: Record<string, number> = {};

        // Helper to format YYYY-MM-DD
        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        // Prepare last 7 days for the chart
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dailyRevenue[formatDate(d)] = 0;
        }

        orders.forEach((order: any) => {
            const isEarned = ['SERVED', 'COMPLETED'].includes(order.status);
            const dateStr = formatDate(order.createdAt);

            if (isEarned) {
                totalRevenue += order.totalAmount;
                completedOrders++;

                // Add to daily if within last 7 days
                if (dailyRevenue.hasOwnProperty(dateStr)) {
                    dailyRevenue[dateStr] += order.totalAmount;
                }

                // Aggregate Product Stats
                const items = order.items as any;
                if (items) {
                    Object.values(items).forEach((item: any) => {
                        const name = item.name || 'Bilinmeyen Ürün';
                        if (!productStats[name]) {
                            productStats[name] = { name, quantity: 0, revenue: 0 };
                        }
                        productStats[name].quantity += (item.quantity || 1);
                        productStats[name].revenue += (item.price || 0) * (item.quantity || 1);
                    });
                }
            } else if (['PENDING', 'PREPARING'].includes(order.status)) {
                activeOrders++;
            }
        });

        // Sort Top Products
        const topProducts = Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Map daily revenue to array for charts
        const revenueChart = Object.entries(dailyRevenue)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({
            stats: {
                totalRevenue,
                orderCount: orders.length,
                completedOrders,
                activeOrders,
                avgOrderValue: completedOrders > 0 ? totalRevenue / completedOrders : 0
            },
            topProducts,
            revenueChart,
            recentOrders: orders.slice(0, 10) // Return 10 most recent
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
