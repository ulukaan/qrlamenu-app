import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth';
import QRGeneratorClient from '@/components/restaurant/QRGeneratorClient';

export default async function QrOlusturucuPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        redirect('/login');
    }

    const user = await validateSession(token);

    if (!user) {
        redirect('/login');
    }

    // If user is a Super Admin or has no tenant, they shouldn't be here or we handle it
    // validateSession returns user which includes tenant.

    // Check if user has a tenant
    // Note: The type returned by validateSession might be complex, let's cast or check safely
    const tenant = (user as any).tenant;

    if (!tenant) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Restoran Bulunamadı</h1>
                <p>Bu hesaba bağlı bir restoran bulunmamaktadır.</p>
            </div>
        );
    }

    return <QRGeneratorClient slug={tenant.slug} tenantName={tenant.name} logoUrl={tenant.logoUrl} />;
}
