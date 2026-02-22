import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tenantId, theme } = body;

        if (!tenantId || !theme) {
            return NextResponse.json({ error: 'Eksik parametreler (tenantId, theme)' }, { status: 400 });
        }

        // Validate theme
        const validThemes = ['LITE', 'CLASSIC', 'MODERN', 'SIGNATURE'];
        if (!validThemes.includes(theme)) {
            return NextResponse.json({ error: 'Geçersiz tema' }, { status: 400 });
        }

        // Update tenant
        const updatedTenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: { theme },
        });

        return NextResponse.json({ success: true, theme: updatedTenant.theme });

    } catch (error: any) {
        console.error('Theme Update Error:', error);
        return NextResponse.json({ error: 'Tema güncellenemedi', details: error.message }, { status: 500 });
    }
}
