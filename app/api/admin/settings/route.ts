import { NextResponse } from 'next/server';

// Temporary in-memory store since there may not be an appropriate Prisma table.
let mockSettings = {
    platformTitle: 'QRlamenü Premium SaaS',
    contactEmail: 'admin@qrlamenu.com',
    smtpHost: 'smtp.qrlamenu.com',
    smtpPort: 465,
    maintenanceMode: false
};

export async function GET() {
    try {
        return NextResponse.json(mockSettings);
    } catch (error) {
        console.error('Fetch Settings Error:', error);
        return NextResponse.json({ error: 'Ayarlar bilgisi alınamadı.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Update mock settings
        mockSettings = {
            ...mockSettings,
            ...body
        };

        return NextResponse.json({ success: true, settings: mockSettings });
    } catch (error) {
        console.error('Update Settings Error:', error);
        return NextResponse.json({ error: 'Ayarlar güncellenemedi.' }, { status: 500 });
    }
}
