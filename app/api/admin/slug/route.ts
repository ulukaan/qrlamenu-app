import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const tenants = await prisma.tenant.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                customDomain: true,
                status: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(tenants);
    } catch (error) {
        console.error('Fetch Slug/Domain Error:', error);
        return NextResponse.json({ error: 'Domain verileri alınamadı.' }, { status: 500 });
    }
}
