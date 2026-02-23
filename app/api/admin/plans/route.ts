import { NextResponse } from 'next/server';

const mockPlans = [
    {
        id: 'p-1',
        name: 'Starter Plan',
        code: 'starter',
        price: 499,
        branchLimit: 1,
        tableLimit: 50,
        features: ['QR Menü', 'Temel Raporlama', 'Gelişmiş Sipariş Yönetimi']
    },
    {
        id: 'p-2',
        name: 'Business Pro',
        code: 'pro',
        price: 999,
        branchLimit: 3,
        tableLimit: 150,
        features: ['QR Menü', 'Gelişmiş Raporlama', 'Stok Yönetimi', 'Müşteri Sadakat Programı']
    },
    {
        id: 'p-3',
        name: 'Enterprise Premium',
        code: 'enterprise',
        price: 2499,
        branchLimit: 10,
        tableLimit: 500,
        features: ['Tüm Pro Özellikler', 'Özel API Erişimi', '7/24 Öncelikli Telefon Desteği', 'Özel Entegrasyonlar']
    }
];

export async function GET() {
    try {
        return NextResponse.json(mockPlans);
    } catch (error) {
        return NextResponse.json({ error: 'Planlar alınamadı.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newPlan = { ...body, id: `p-${Date.now()}` };
        mockPlans.push(newPlan);
        return NextResponse.json(newPlan);
    } catch (error) {
        return NextResponse.json({ error: 'Plan oluşturulamadı.' }, { status: 500 });
    }
}
