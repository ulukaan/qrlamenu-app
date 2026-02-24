import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LogLevel } from '@prisma/client';

export async function GET() {
    try {
        let logs = await prisma.systemLog.findMany({
            take: 50,
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (logs.length === 0) {
            // Seed initial logs if empty
            await prisma.systemLog.createMany({
                data: [
                    { level: 'INFO', message: 'MESA SaaS Platformu başlatıldı.', category: 'SYSTEM' },
                    { level: 'SUCCESS', message: 'Veritabanı bağlantısı başarıyla kuruldu.', category: 'DATABASE' },
                    { level: 'INFO', message: 'RabbitMQ / Pusher servisleri dinleniyor.', category: 'SERVICE' },
                    { level: 'WARNING', message: 'Bilinmeyen bir IP (192.168.1.55) admin paneline erişmeyi denedi.', category: 'SECURITY' },
                    { level: 'SUCCESS', message: 'Super Admin hesabı doğrulandı.', category: 'AUTH' },
                    { level: 'ERROR', message: 'Bozuk veya eksik payload (orders API) reddedildi.', category: 'API' },
                ]
            });

            logs = await prisma.systemLog.findMany({
                take: 50,
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Fetch Logs Error:', error);
        return NextResponse.json({ error: 'Sistem logları alınamadı.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await prisma.systemLog.deleteMany({});
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Clear Logs Error:', error);
        return NextResponse.json({ error: 'Loglar temizlenemedi.' }, { status: 500 });
    }
}
