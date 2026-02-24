import { prisma } from '@/lib/prisma';

export async function checkTenantLimits(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
            plan: true,
            _count: {
                select: {
                    users: true,
                    categories: true,
                    products: true,
                    // If we had a branches/tables model we would count them here
                }
            }
        }
    });

    if (!tenant) throw new Error('Tenant bulunamadı');

    const isTrial = tenant.status === 'TRIAL';
    const hasTrialExpired = isTrial && tenant.trialExpiresAt && tenant.trialExpiresAt < new Date();

    if (hasTrialExpired) {
        return {
            allowed: false,
            reason: 'Deneme süreniz dolmuştur. Lütfen bir abonelik paketi seçin.',
            limits: null
        };
    }

    if (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL') {
        return {
            allowed: false,
            reason: 'Hesabınız aktif değildir. Lütfen destek ile iletişime geçin.',
            limits: null
        };
    }

    // Paket limitleri
    const plan = tenant.plan;

    return {
        allowed: true,
        reason: null,
        limits: {
            branchLimit: plan.branchLimit,
            tableLimit: plan.tableLimit,
            features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
            currentUsage: {
                users: tenant._count.users,
                categories: tenant._count.categories,
                products: tenant._count.products
            }
        }
    };
}

export function hasFeature(limits: any, featureKeyword: string): boolean {
    if (!limits || !limits.features) return false;
    const features: string[] = Array.isArray(limits.features) ? limits.features : [];

    // "Her Şey Dahil" veya benzeri sarmalayıcı özellikler varsa
    if (features.some(f => f.toLowerCase().includes('her şey dahil') || f.toLowerCase().includes('tüm özellikler'))) {
        return true;
    }

    return features.some(f => f.toLowerCase().includes(featureKeyword.toLowerCase()));
}
