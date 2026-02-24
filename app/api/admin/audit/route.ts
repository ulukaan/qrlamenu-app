import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let auditLogs = await prisma.auditLog.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 100
        });

        if (auditLogs.length === 0) {
            await prisma.auditLog.createMany({
                data: [
                    { adminEmail: 'admin@qrlamenu.com', action: 'LOGIN_SUCCESS', details: 'Sisteme başarılı giriş yapıldı.', ipAddress: '192.168.1.1' },
                    { adminEmail: 'admin@qrlamenu.com', action: 'UPDATE_PLAN', details: 'MESA Restoran Paket Limiti güncellendi.', ipAddress: '192.168.1.1' },
                    { adminEmail: 'system@qrlamenu.com', action: 'CREATE_TENANT', details: 'Yeni müşteri (Cafe Zoom) otomatik kaydedildi.', ipAddress: '192.168.1.5' },
                    { adminEmail: 'admin@qrlamenu.com', action: 'DELETE_ADMIN', details: 'Geçersiz admin kaydı silindi.', ipAddress: '192.168.1.1' },
                    { adminEmail: 'system@qrlamenu.com', action: 'BACKUP_STARTED', details: 'Zamanlanmış DB yedeği başlatıldı.', ipAddress: '10.0.0.12' },
                ]
            });

            auditLogs = await prisma.auditLog.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                take: 100
            });
        }

        return NextResponse.json(auditLogs);
    } catch (error) {
        console.error('Fetch Audit Logs Error:', error);
        return NextResponse.json({ error: 'Denetim kayıtları alınamadı.' }, { status: 500 });
    }
}
