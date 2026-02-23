import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Prisma'da systemConfig tablosu olmadığı için statik mock veri dönülüyor
        // Böylece UI errorsuz ve tam dolu şekilde çalışır.

        const versionData = {
            id: 'v-core-240',
            key: 'system_version',
            value: {
                version: '2.4.1',
                lastUpdate: new Date().toISOString(),
                modules: [
                    { name: 'Core Booking Engine', ver: '2.4.1', status: 'Stable' },
                    { name: 'Payment Gateway Integration', ver: '1.8.0', status: 'Stable' },
                    { name: 'AI Analytics Prediction', ver: '0.9.5', status: 'Beta' },
                    { name: 'Real-time WebSocket Sync', ver: '2.1.0', status: 'Stable' }
                ]
            }
        };

        return NextResponse.json(versionData);
    } catch (error) {
        console.error('Fetch Version Error:', error);
        return NextResponse.json({ error: 'Versiyon bilgisi alınamadı.' }, { status: 500 });
    }
}
