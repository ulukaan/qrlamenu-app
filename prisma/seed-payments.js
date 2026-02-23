const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('💸 Ödeme verileri oluşturuluyor...');

    // Get some tenants to link payments
    const tenants = await prisma.tenant.findMany({ take: 5 });

    if (tenants.length === 0) {
        console.log('⚠️ Ödeme eklemek için önce en az bir restoran (tenant) olmalı.');
        return;
    }

    const transactions = [
        {
            title: 'Profesyonel Plan - 1 Yıllık Tahsilat',
            amount: 5990.00,
            paymentMethod: 'Iyzico / Kredi Kartı',
            status: 'COMPLETED',
            tenantId: tenants[0].id,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
            title: 'Başlangıç Planı - Aylık Abonelik',
            amount: 299.00,
            paymentMethod: 'Havale / EFT',
            status: 'COMPLETED',
            tenantId: tenants[1 % tenants.length].id,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        },
        {
            title: 'Özel Tema Geliştirme Ücreti',
            amount: 1500.00,
            paymentMethod: 'Iyzico / Kredi Kartı',
            status: 'PENDING',
            tenantId: tenants[2 % tenants.length].id,
            createdAt: new Date()
        },
        {
            title: 'Kurumsal Paket Yenileme',
            amount: 12000.00,
            paymentMethod: 'Havale / EFT',
            status: 'COMPLETED',
            tenantId: tenants[0].id,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
        },
        {
            title: 'Abonelik İptal / İade Denemesi',
            amount: -299.00,
            paymentMethod: 'Sistem İadesi',
            status: 'FAILED',
            tenantId: tenants[Math.min(3, tenants.length - 1)].id,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
    ];

    for (const tx of transactions) {
        await prisma.transaction.create({
            data: tx
        });
        console.log(`✅ İşlem eklendi: ${tx.title} - ₺${tx.amount}`);
    }

    console.log('✨ Finansal veriler başarıyla hazırlandı!');
}

main()
    .catch((e) => {
        console.error('❌ Hata oluştu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
