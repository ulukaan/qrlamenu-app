import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkTenantLimits, hasFeature } from '@/lib/limits';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    try {
        const limitCheck = await checkTenantLimits(tenantId);
        if (!limitCheck.allowed || !hasFeature(limitCheck.limits, 'Analizler & Kampanyalar')) {
            return NextResponse.json([]); // Özellik yoksa veya süre bittiyse kampanya yok
        }

        const campaigns = await (prisma as any).campaign.findMany({
            where: {
                tenantId,
                isActive: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}
