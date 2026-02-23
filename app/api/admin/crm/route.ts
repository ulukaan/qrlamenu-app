import { NextResponse } from 'next/server';

const mockLeads = [
    {
        id: 'c-1001',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@restoran.com',
        phone: '+90 555 123 4567',
        notes: 'Sisteminize yeni restoran eklemek istiyorum ancak franchise şubelerim için paket fiyatınız nedir?',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: 'c-1002',
        name: 'Ayşe Kaya',
        email: 'ayse.kaya@cafezoom.net',
        phone: '+90 532 987 6543',
        notes: 'Geçen ay aldığımız adisyon modülünde termal yazıcı ile ilgili küçük bir bağlantı problemi yaşıyoruz.',
        status: 'RESOLVED',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: 'c-1003',
        name: 'Mehmet Demir',
        email: 'mehmet@demir-lounge.com',
        phone: '',
        notes: 'QR menü tasarımımızda renkleri kendi logomuza göre özelleştirmeyi bulamadık, yardımcı olur musunuz?',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    }
];

export async function GET() {
    try {
        // İleride veritabanı (örn. ContactForm / CRM Lead tablosu) bağlandığında buradan çekilebilir
        return NextResponse.json(mockLeads);
    } catch (error) {
        console.error('Fetch CRM Leads Error:', error);
        return NextResponse.json({ error: 'Talepler alınamadı.' }, { status: 500 });
    }
}
