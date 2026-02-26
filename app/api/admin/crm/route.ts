import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';
import { cookies } from 'next/headers';
import { validateSession, isSuperAdmin } from '@/lib/auth';

async function checkAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const session = await validateSession(token);
    if (!isSuperAdmin(session)) return null;
    return session;
}

export async function GET(request: Request) {
    const session = await checkAuth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const session = await checkAuth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
