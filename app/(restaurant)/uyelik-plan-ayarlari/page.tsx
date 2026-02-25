
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PlanSettingsClient from '@/components/restaurant/PlanSettingsClient';

export default async function UyelikPlanAyarlari() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        redirect('/login');
    }

    const sessionUser = await validateSession(token);

    if (!sessionUser) {
        redirect('/login');
    }

    // validateSession returns a User or SuperAdmin. 
    // We need to fetch the tenant with plan details properly to be sure.
    // Assuming sessionUser has tenantId if it's a normal user
    const userRole = (sessionUser as any).role;
    let tenantId = (sessionUser as any).tenantId;

    if (userRole === 'SUPER_ADMIN') {
        // Super admin viewing this page... might need a specific tenant context or just redirect
        // For now, let's redirect to dashboard or show error
        return <div>Super Admin view not implemented for this page.</div>;
    }

    if (!tenantId) {
        // Should not happen for a logged in RESTAURANT user
        return <div>Tenant ID not found.</div>;
    }

    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
            plan: true
        }
    });

    if (!tenant) {
        return <div>Tenant not found.</div>;
    }

    // Fetch all available plans
    let allPlansRaw = await prisma.subscriptionPlan.findMany({
        orderBy: { price: 'asc' }
    });

    // Auto-seed Fallback (Live Fix)
    if (allPlansRaw.length === 0) {
        const defaultPlans = [
            { name: 'Ücretsiz', code: 'free', price: 0, branchLimit: 1, tableLimit: 10, features: ['Temel QR Menü', '50 Ürün Limiti', 'Dijital Menü Görünümü', 'Standart Destek'] },
            { name: 'Başlangıç', code: 'starter', price: 590, branchLimit: 1, tableLimit: 25, features: ['Sınırsız Ürün', 'Masa Takibi', 'Günlük Ciro Raporu'] },
            { name: 'Profesyonel', code: 'pro', price: 1290, branchLimit: 1, tableLimit: 100, features: ['Garson Çağrı Sistemi', 'Gelişmiş Analiz', 'Premium Tema'] },
            { name: 'Growth+', code: 'growth', price: 1990, branchLimit: 3, tableLimit: 300, features: ['Stok Takibi', 'Çoklu Kasa', 'Şube Altyapısı'] },
            { name: 'Premium', code: 'premium', price: 2990, branchLimit: 10, tableLimit: 1000, features: ['Tüm Özellikler Dahil', 'Branding Opsiyonları', '7/24 Öncelikli Destek'] },
            { name: 'Kurumsal / VIP', code: 'enterprise', price: 5990, branchLimit: 999, tableLimit: 999, features: ['White Label', 'SLA Garantisi', 'ERP Entegrasyonu'] }
        ];

        for (const p of defaultPlans) {
            await prisma.subscriptionPlan.upsert({
                where: { code: p.code },
                update: {},
                create: p
            });
        }

        allPlansRaw = await prisma.subscriptionPlan.findMany({
            orderBy: { price: 'asc' }
        });
    }

    const allPlans = allPlansRaw.map(p => ({
        ...p,
        features: p.features as string[]
    }));

    // Mock dates for now if they don't exist in DB (DB has trialExpiresAt but not explicit start/end for subscription cycle usually in simple schemes)
    // We can use updated at or create mock logic
    const currentPlanData = {
        ...tenant.plan,
        features: tenant.plan.features as string[],
        startDate: tenant.createdAt,
        endDate: tenant.trialExpiresAt ? tenant.trialExpiresAt : new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // Default 1 year from now if not trial
    };

    return (
        <PlanSettingsClient
            currentPlan={currentPlanData}
            allPlans={allPlans}
            tenantName={tenant.name}
        />
    );
}
