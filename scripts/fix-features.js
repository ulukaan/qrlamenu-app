const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Feature Fix Start ---');

    // Profesyonel (pro) ve Growth+ (growth) planlarına sipariş yetkisi ekle
    const plans = await prisma.subscriptionPlan.findMany({
        where: {
            code: { in: ['pro', 'growth', 'kurumsal'] }
        }
    });

    for (const plan of plans) {
        let features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || '[]');
        if (!features.includes('Sipariş Alma')) {
            features.push('Sipariş Alma');
        }
        if (!features.includes('Gelişmiş Sipariş Yönetimi')) {
            features.push('Gelişmiş Sipariş Yönetimi');
        }

        await prisma.subscriptionPlan.update({
            where: { id: plan.id },
            data: { features }
        });
        console.log(`✅ ${plan.name} planı güncellendi.`);
    }

    // Restoran ayarlarını da aktif et
    const tenant = await prisma.tenant.findUnique({
        where: { slug: 'qrlamenu-premium' }
    });

    if (tenant) {
        const settings = typeof tenant.settings === 'string' ? JSON.parse(tenant.settings) : (tenant.settings || {});
        settings.allowOnTableOrder = true;
        settings.allowTakeawayOrder = true;
        settings.allowCallWaiter = true;

        await prisma.tenant.update({
            where: { id: tenant.id },
            data: { settings }
        });
        console.log('✅ QRlamenü Premium ayarları aktif edildi.');
    }

    console.log('--- Feature Fix Completed ---');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
