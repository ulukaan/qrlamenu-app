import { NextResponse } from 'next/server';

let mockPayments = [
    {
        id: 'pay-1',
        tenantId: 't-12345',
        tenant: { name: 'Gourmet Burgerhouse' },
        title: 'Business Pro - 1 Aylık',
        amount: 999,
        paymentMethod: 'Kredi Kartı',
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    },
    {
        id: 'pay-2',
        tenantId: 't-67890',
        tenant: { name: 'Sushi Zen' },
        title: 'Starter Plan - Yıllık Peşin',
        amount: 4990,
        paymentMethod: 'HAVALE',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
    },
    {
        id: 'pay-3',
        tenantId: 't-13579',
        tenant: { name: 'Cafe de Paris' },
        title: 'Enterprise Premium',
        amount: 2499,
        paymentMethod: 'Kredi Kartı',
        status: 'FAILED',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    }
];

export async function GET() {
    try {
        return NextResponse.json(mockPayments);
    } catch (error) {
        return NextResponse.json({ error: 'Ödemeler alınamadı.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newPayment = {
            ...body,
            id: `pay-${Date.now()}`,
            tenant: { name: 'Bilinmeyen Restoran' }, // Tenant ilişkisi mock
            createdAt: new Date().toISOString()
        };
        mockPayments = [newPayment, ...mockPayments];
        return NextResponse.json(newPayment);
    } catch (error) {
        return NextResponse.json({ error: 'Ödeme eklenemedi.' }, { status: 500 });
    }
}
