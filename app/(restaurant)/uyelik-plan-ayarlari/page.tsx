import React from 'react';
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
    const allPlansRaw = await prisma.subscriptionPlan.findMany({
        orderBy: {
            price: 'asc'
        }
    });

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
