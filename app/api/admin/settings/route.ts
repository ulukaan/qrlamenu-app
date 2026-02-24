import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const defaultSettings = {
    platformTitle: 'QRlamenü Premium SaaS',
    contactEmail: 'admin@qrlamenu.com',
    smtpHost: 'smtp.qrlamenu.com',
    smtpPort: 465,
    maintenanceMode: false
};

export async function GET() {
    try {
        let configRecord = await prisma.systemConfig.findUnique({
            where: { key: 'global_settings' }
        });

        if (!configRecord) {
            configRecord = await prisma.systemConfig.create({
                data: {
                    key: 'global_settings',
                    value: defaultSettings
                }
            });
        }

        return NextResponse.json(configRecord.value);
    } catch (error) {
        console.error('Fetch Settings Error:', error);
        return NextResponse.json({ error: 'Ayarlar bilgisi alınamadı.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Check if config exists
        let configRecord = await prisma.systemConfig.findUnique({
            where: { key: 'global_settings' }
        });

        // Merge old and new values
        const mergedValues = {
            ...(configRecord ? (configRecord.value as object) : defaultSettings),
            ...body
        };

        const updatedConfig = await prisma.systemConfig.upsert({
            where: { key: 'global_settings' },
            update: { value: mergedValues },
            create: { key: 'global_settings', value: mergedValues }
        });

        return NextResponse.json({ success: true, settings: updatedConfig.value });
    } catch (error) {
        console.error('Update Settings Error:', error);
        return NextResponse.json({ error: 'Ayarlar güncellenemedi.' }, { status: 500 });
    }
}
