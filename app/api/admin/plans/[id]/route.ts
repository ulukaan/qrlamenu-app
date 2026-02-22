import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, code, price, branchLimit, tableLimit, features } = body;

        const updated = await prisma.subscriptionPlan.update({
            where: { id: params.id },
            data: {
                name,
                code,
                price: parseFloat(price),
                branchLimit: parseInt(branchLimit),
                tableLimit: parseInt(tableLimit),
                features
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update Plan Error:', error);
        return NextResponse.json({ error: 'Plan güncellenirken hata oluştu.' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Check if there are tenants using this plan
        const tenantCount = await prisma.tenant.count({
            where: { planId: params.id }
        });

        if (tenantCount > 0) {
            return NextResponse.json({
                error: `Bu planı kullanan ${tenantCount} adet restoran bulunuyor. Silmek için önce bu restoranların planını değiştirin.`
            }, { status: 400 });
        }

        await prisma.subscriptionPlan.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Plan Error:', error);
        return NextResponse.json({ error: 'Plan silinemedi.' }, { status: 500 });
    }
}
