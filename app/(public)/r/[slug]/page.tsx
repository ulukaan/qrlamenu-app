
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import MenuClient from '@/components/public/MenuClient';

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
    const settings = (tenant.settings as any) || {};

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
    return <MenuClient restaurant={formattedRestaurant} defaultTheme={tenant.theme || 'LITE'} />;
}

