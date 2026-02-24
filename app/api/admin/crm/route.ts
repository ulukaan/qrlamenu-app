import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get('status');

        const validStatuses = ['PENDING', 'CONTACTED', 'CONVERTED', 'LOST'];
        const status = validStatuses.includes(statusParam as string) ? (statusParam as LeadStatus) : undefined;

        const leads = await prisma.lead.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' }
        });

        // Map to expected UI format
        const formattedLeads = leads.map(l => ({
            id: l.id,
            name: l.name,
            email: l.email || '',
            phone: l.phone || '',
            notes: l.notes || '',
            status: l.status,
            createdAt: l.createdAt.toISOString()
        }));

        return NextResponse.json(formattedLeads);
    } catch (error) {
        console.error('Fetch CRM Leads Error:', error);
        return NextResponse.json({ error: 'Talepler alınamadı.' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
        }

        const validStatuses = ['PENDING', 'CONTACTED', 'CONVERTED', 'LOST'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Geçersiz destek durumu.' }, { status: 400 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: { status: status as LeadStatus }
        });

        return NextResponse.json(updatedLead);
    } catch (error) {
        console.error('Update CRM Lead Error:', error);
        return NextResponse.json({ error: 'Kayıt güncellenemedi.' }, { status: 500 });
    }
}
