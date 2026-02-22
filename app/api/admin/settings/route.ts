import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.systemConfig.findUnique({
            where: { key: 'global_settings' }
        });

        if (!config) {
            return NextResponse.json({
                platformTitle: 'QRlamenü Multi-Tenant',
                platformLogo: '',
                contactEmail: 'support@qrlamenu.com',
                smtpHost: 'smtp.qrlamenu.com',
                smtpPort: 587,
                maintenanceMode: false
            });
        }

        return NextResponse.json(config.value);
    } catch (error) {
        console.error('Fetch Settings Error:', error);
        return NextResponse.json({ error: 'Sistem ayarları alınamadı.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const updated = await prisma.systemConfig.upsert({
            where: { key: 'global_settings' },
            update: { value: body },
            create: {
                key: 'global_settings',
                value: body
            }
        });

        return NextResponse.json(updated.value);
    } catch (error) {
        console.error('Update Settings Error:', error);
        return NextResponse.json({ error: 'Ayarlar kaydedilirken hata oluştu.' }, { status: 500 });
    }
}
