import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch system version from config or use default
        // @ts-ignore
        let systemConfig = await prisma.systemConfig.findUnique({
            where: { key: 'system_version' }
        });

        if (!systemConfig) {
            return NextResponse.json({ error: 'Versiyon bilgisi yapılandırılmamış.' }, { status: 404 });
        }

        return NextResponse.json(systemConfig);
    } catch (error) {
        console.error('Fetch Version Error:', error);
        return NextResponse.json({ error: 'Versiyon bilgisi alınamadı.' }, { status: 500 });
    }
}
