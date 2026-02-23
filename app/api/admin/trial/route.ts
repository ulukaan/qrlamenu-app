import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const trials = await prisma.tenant.findMany({
            where: {
                status: 'TRIAL'
            },
            include: {
                plan: true
            },
            orderBy: {
                trialExpiresAt: 'asc'
            }
        });

        return NextResponse.json(trials);
    } catch (error) {
        console.error('Fetch Trials Error:', error);
        return NextResponse.json({ error: 'Trial verileri alınamadı.' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, trialExpiresAt, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Tenant ID gerekli.' }, { status: 400 });
        }

        const updateData: any = {};
        if (trialExpiresAt) updateData.trialExpiresAt = new Date(trialExpiresAt);
        if (status) updateData.status = status;

        const updatedTenant = await prisma.tenant.update({
            where: { id },
            data: updateData,
            include: {
                plan: true
            }
        });

        return NextResponse.json(updatedTenant);
    } catch (error) {
        console.error('Update Trial Error:', error);
        return NextResponse.json({ error: 'Trial bilgileri güncellenemedi.' }, { status: 500 });
    }
}
