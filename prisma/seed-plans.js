const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('💳 Abonelik paketleri oluşturuluyor...');

    const plans = [
        {
            name: 'Başlangıç',
            code: 'starter',
            price: 590,
            branchLimit: 1,
            tableLimit: 999, // Sınırsız
            features: [
                'QR Menü (Mobil Optimize)',
                'Sınırsız Ürün Ekleme',
                'Masa Bazlı Sipariş Takibi',
                'Günlük Ciro Özeti',
                'Basit Satış Raporu',
                '1 Kullanıcı',
                'Standart Tema (1 adet)'
            ]
        },
        {
            name: 'Profesyonel',
            code: 'pro',
            price: 1290,
            branchLimit: 1,
            tableLimit: 999,
            features: [
                'Tüm Başlangıç Özellikleri',
                'Garson Çağrı Sistemi',
                'Ürün Bazlı Satış Analizi',
                'Saatlik Satış Grafiği',
                'Masa Doluluk Raporu',
                'Kampanya Banner Alanı',
                'WhatsApp Sipariş Yönlendirme',
                '6+ Premium Tema',
                '5 Kullanıcı',
                'Logo & Renk Özelleştirme'
            ]
        },
        {
            name: 'Growth+',
            code: 'growth',
            price: 1990,
            branchLimit: 1, // Şube açmaya hazır altyapı
            tableLimit: 999,
            features: [
                'Tüm Profesyonel Özellikleri',
                'Stok Takibi (Ürün Düşümü)',
                'Rol Bazlı Yetkilendirme',
                'Çoklu Kasa Raporu',
                'Şube Açmaya Hazır Altyapı',
                'API Erişimi',
                'POS Entegrasyon Altyapısı',
                'Özel Kampanya Kurguları',
                'Öncelikli Destek'
            ]
        },
        {
            name: 'Kurumsal',
            code: 'enterprise',
            price: 3990,
            branchLimit: 999, // Sınırsız Şube
            tableLimit: 999,
            features: [
                'Tüm Growth+ Özellikleri',
                'Sınırsız Şube',
                'Merkezi Dashboard (Tüm Şubeler)',
                'Şube Performans Karşılaştırma',
                'Özel Domain',
                'ERP / Muhasebe Entegrasyonu',
                'SLA Destek',
                'Özel Onboarding'
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
