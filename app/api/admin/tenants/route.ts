import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const tenants = await prisma.tenant.findMany({
            include: {
                plan: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(tenants);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const newTenant = await prisma.tenant.create({
            data: {
                name: data.name,
                slug: data.slug,
                ownerEmail: data.ownerEmail || 'info@qrlamenu.com',
                planId: data.planId,
                status: 'ACTIVE',
                trialExpiresAt: data.isTrial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null
            }
        });
        return NextResponse.json(newTenant);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Kayıt oluşturulamadı' }, { status: 500 });
    }
}
