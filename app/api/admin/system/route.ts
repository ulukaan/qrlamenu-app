import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import os from 'os';

export async function GET() {
    try {
        // 1. Veritabanı İstatistikleri
        const [
            tenants,
            users,
            products,
            orders,
            waiterCalls,
            logs,
            transactions
        ] = await Promise.all([
            prisma.tenant.count(),
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.waiterCall.count(),
            prisma.systemLog.count(),
            prisma.transaction.count()
        ]);

        // 2. Sistem Bilgileri
        const systemInfo = {
            platform: os.platform(),
            nodeVersion: process.version,
            uptime: Math.round(process.uptime()), // seconds
            memoryUsage: {
                free: os.freemem(),
                total: os.totalmem(),
                percent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
            },
            cpus: os.cpus().length,
            load: os.loadavg()
        };

        // 3. Veritabanı Tablo Detayları (Arayüzde görselleştirme için)
        const dbStats = [
            { name: 'Restoranlar', count: tenants, color: '#ff7a21', icon: 'Store' },
            { name: 'Kullanıcılar', count: users, color: '#3b82f6', icon: 'Users' },
            { name: 'Ürünler', count: products, color: '#10b981', icon: 'Utensils' },
            { name: 'Siparişler', count: orders, color: '#8b5cf6', icon: 'ShoppingBag' },
            { name: 'Garson Çağrıları', count: waiterCalls, color: '#f59e0b', icon: 'Bell' },
            { name: 'Sistem Logları', count: logs, color: '#64748b', icon: 'FileText' },
            { name: 'Ödemeler', count: transactions, color: '#ec4899', icon: 'CreditCard' }
        ];

        return NextResponse.json({
            status: 'HEALTHY',
            timestamp: new Date().toISOString(),
            system: systemInfo,
            db: dbStats
        });
    } catch (error) {
        console.error('System Check Error:', error);
        return NextResponse.json({
            status: 'ERROR',
            message: 'Sistem verileri alınamadı.'
        }, { status: 500 });
    }
}
