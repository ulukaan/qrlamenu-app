import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: params.id },
            include: {
                plan: true,
                _count: {
                    select: {
                        products: true,
                        categories: true,
                        orders: true,
                        users: true
                    }
                }
            }
        });

        if (!tenant) {
            return NextResponse.json({ error: 'Restoran bulunamadı.' }, { status: 404 });
        }

        return NextResponse.json(tenant);
    } catch (error) {
        console.error('Fetch Tenant Error:', error);
        return NextResponse.json({ error: 'Restoran bilgileri alınamadı.' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, slug, ownerEmail, status, planId, theme, customDomain, trialExpiresAt } = body;

        const updated = await prisma.tenant.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                ownerEmail,
                status,
                planId,
                theme,
                customDomain: customDomain || null,
                trialExpiresAt: trialExpiresAt ? new Date(trialExpiresAt) : null
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update Tenant Error:', error);
        return NextResponse.json({ error: 'Güncelleme sırasında hata oluştu.' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.tenant.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Tenant Error:', error);
        return NextResponse.json({ error: 'Silme işlemi sırasında hata oluştu.' }, { status: 500 });
    }
}
