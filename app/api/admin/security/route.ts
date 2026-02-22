import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.systemConfig.findUnique({
            where: { key: 'security_settings' }
        });

        if (!config) {
            return NextResponse.json({
                twoFA: false,
                ipWhitelist: false,
                sessionTimeout: 30,
                minPasswordLength: 8
            });
        }

        return NextResponse.json(config.value);
    } catch (error) {
        console.error('Fetch Security Settings Error:', error);
        return NextResponse.json({ error: 'Güvenlik ayarları alınamadı.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const updated = await prisma.systemConfig.upsert({
            where: { key: 'security_settings' },
            update: { value: body },
            create: {
                key: 'security_settings',
                value: body
            }
        });

        return NextResponse.json(updated.value);
    } catch (error) {
        console.error('Update Security Settings Error:', error);
        return NextResponse.json({ error: 'Ayarlar güncellenirken hata oluştu.' }, { status: 500 });
    }
}
