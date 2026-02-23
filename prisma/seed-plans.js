const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('💳 Abonelik paketleri oluşturuluyor...');

    const plans = [
        {
            name: 'Ücretsiz (Deneme)',
            code: 'free',
            price: 0,
            branchLimit: 1,
            tableLimit: 5,
            features: [
                'Temel QR Menü',
                '1 Adet Şube',
                '5 Masa Limiti',
                'Standart Destek'
            ]
        },
        {
            name: 'Başlangıç (Starter)',
            code: 'starter',
            price: 299,
            branchLimit: 1,
            tableLimit: 20,
            features: [
                'Gelişmiş QR Menü',
                '1 Adet Şube',
                '20 Masa Limiti',
                'Öncelikli Destek',
                'Özel Tema Seçimi'
            ]
        },
        {
            name: 'Profesyonel (Pro)',
            code: 'pro',
            price: 599,
            branchLimit: 3,
            tableLimit: 100,
            features: [
                'Sınırsız QR Menü',
                '3 Adet Şube Yönetimi',
                '100 Masa Limiti',
                '7/24 Teknik Destek',
                'Garson Çağırma Sistemi',
                'Gelişmiş İstatistikler'
            ]
        }
    ];

    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where: { code: plan.code },
            update: plan,
            create: plan
        });
        console.log(`✅ Paket eklendi/güncellendi: ${plan.name} (${plan.code})`);
    }

    console.log('✨ Abonelik paketleri başarıyla hazırlandı!');
}

main()
    .catch((e) => {
        console.error('❌ Hata oluştu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
