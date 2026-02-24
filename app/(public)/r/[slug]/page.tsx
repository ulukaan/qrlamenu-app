import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import MenuClient from '@/components/public/MenuClient';
import { checkTenantLimits, hasFeature } from '@/lib/limits';
import { AlertCircle } from 'lucide-react';

// Prevent caching so availability changes reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function RestaurantPage({ params }: PageProps) {
    const { slug } = params;

    // Fetch tenant with categories and products
    const tenant = await prisma.tenant.findUnique({
        where: {
            slug: slug
        },
        include: {
            categories: {
                include: {
                    products: {
                        where: {
                            isAvailable: true
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });

    if (!tenant) {
        notFound();
    }

    // Debug: log product counts
    console.log('[Menu] Slug:', slug, '| Categories:', tenant.categories.length, '| Products per cat:', tenant.categories.map(c => `${c.name}: ${c.products.length}`));

    // Transform Prisma data to match UI component expectations
    let settings = (tenant.settings as any) || {};

    // GÜVENLİK (FEATURE GATING BYPASS KORUMASI): 
    // Müşterinin önceden Premium pakette satın alıp aktif ettiği özellikler şu anki paketinde yoksa (örn: downgrade), 
    // DB'de 'true' kalsa bile Public render aşamasında kapatılır.
    const limitCheck = await checkTenantLimits(tenant.id);

    // Eğer restoran TRIAL süresini bitirmişse veya hesabı durdurulmuşsa menüyü tamamen kapat.
    if (!limitCheck.allowed) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8f9fa', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
                <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
                <h1 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '8px' }}>Mekan Hizmet Dışıdır</h1>
                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Bu restoranın menüsü şu anda geçici olarak kullanıma kapalıdır.</p>
            </div>
        );
    }

    const limits = limitCheck.limits;

    // Feature zorlaması (Garson Çağrısı)
    if (settings.allowCallWaiter && !hasFeature(limits, 'Garson Çağrı Sistemi')) {
        settings.allowCallWaiter = false;
    }

    // Feature zorlaması (Gelişmiş Sipariş)
    let hasOrderSystem = hasFeature(limits, 'Gelişmiş Sipariş Yönetimi') || hasFeature(limits, 'Sipariş Alma');
    if (!hasOrderSystem) {
        settings.allowOnTableOrder = false;
        settings.allowTakeawayOrder = false;
        settings.allowHotelOrder = false;
        settings.allowDeliveryOrder = false;
    }

    // Tema zorlaması
    let activeTheme = tenant.theme || 'LITE';
    if (activeTheme !== 'LITE' && activeTheme !== 'CLASSIC') {
        if (!hasFeature(limits, 'Premium Tema') && !hasFeature(limits, 'Pro Tema')) {
            activeTheme = 'LITE'; // Yetkisi bittiyse Lite temaya zorunlu düşür.
        }
    }

    const formattedRestaurant = {
        ...tenant,
        description: settings.description || 'Lezzetin ve kalitenin buluşma noktası.',
        address: settings.address || 'Adres bilgisi eklenmemiş',
        phone: settings.whatsapp || '', // Use whatsapp as phone for now
        hours: settings.timing || '09:00 - 23:00',
        rating: 5.0,
        coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop', // Default cover
        socialMedia: {
            instagram: settings.instagram || '#',
            facebook: settings.facebook || '#',
            whatsapp: settings.whatsapp || '#',
            website: settings.website || '#',
            youtube: settings.youtube || '#'
        },
        settings: settings, // Pass all settings
        // Filter out empty categories (no available products)
        categories: tenant.categories
            .filter(cat => cat.products.length > 0)
            .map(cat => ({
                ...cat,
                items: cat.products.map(prod => ({
                    ...prod,
                    image: prod.imageUrl, // Map imageUrl to image for compatibility
                    isPopular: false, // Default
                    allergens: [] // Default
                })),
                products: cat.products.map(prod => ({ // Ensure both keys exist for compatibility
                    ...prod,
                    image: prod.imageUrl,
                    isPopular: false,
                    allergens: []
                }))
            }))
    };

    // Pass data to Client Component
    return <MenuClient restaurant={formattedRestaurant} defaultTheme={activeTheme} />;
}

