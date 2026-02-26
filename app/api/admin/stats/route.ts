import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession, isSuperAdmin } from '@/lib/auth';

async function checkAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const session = await validateSession(token);
    if (!isSuperAdmin(session)) return null;
    return session;
}

export async function GET() {
    const session = await checkAuth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Toplam Restoran Sayısı
        const totalRestaurants = await prisma.tenant.count();

        // 2. Aktif Premium Restoran Sayısı
        // Assuming 'premium' is the code for premium plans
        const activePremium = await prisma.tenant.count({
            where: {
                status: 'ACTIVE',
                plan: {
                    code: 'premium'
                }
            }
        });

        // 3. Toplam Üye Sayısı (Adminler + Süper Adminler hariç olabilir ama şimdilik hepsi)
        const totalUsers = await prisma.user.count();

        // 4. Aylık Gelir Tahmini (Aktif aboneliklerin toplam tutarı)
        const activeTenants = await prisma.tenant.findMany({
            where: { status: 'ACTIVE' },
            include: { plan: true }
        });

        const monthlyRevenue = activeTenants.reduce((acc, tenant) => {
            return acc + (tenant.plan?.price || 0);
        }, 0);

        // 5. Son Kayıt Olan Restoranlar (Son 5)
        const recentRestaurants = await prisma.tenant.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { plan: true }
        });

        // 6. Grafik Verileri
        // Son 6 ayın gelir datası (Transactions üzerinden)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentTransactions = await prisma.transaction.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
                status: 'COMPLETED'
            },
            select: {
                amount: true,
                createdAt: true
            }
        });

        // Aylara göre grupla
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const revenueHistory = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const monthName = months[d.getMonth()];

            const monthTotal = recentTransactions
                .filter(t => t.createdAt.getMonth() === d.getMonth() && t.createdAt.getFullYear() === d.getFullYear())
                .reduce((acc, t) => acc + t.amount, 0);

            return { name: monthName, value: monthTotal || Math.floor(Math.random() * 5000) + 1000 }; // Mock data fallback if empty
        });

        const signupHistory = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const monthName = months[d.getMonth()];
            return { name: monthName, value: Math.floor(Math.random() * 20) + 5 }; // Mock signup data
        });

        const stats = {
            totalRestaurants,
            activePremium,
            totalUsers,
            monthlyRevenue,
            revenueHistory,
            signupHistory,
            recentRestaurants: recentRestaurants.map(t => ({
                id: t.id,
                name: t.name,
                city: 'İstanbul',
                plan: t.plan?.name || 'Plan Yok',
                status: t.status === 'ACTIVE' ? 'Aktif' : 'Pasif',
                date: t.createdAt
            }))
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ error: 'İstatistikler alınamadı.' }, { status: 500 });
    }
}
