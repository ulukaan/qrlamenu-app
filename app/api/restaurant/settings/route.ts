
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

// GET: Fetch restaurant settings
export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
        return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    const tenantId = (sessionUser as any).tenantId;
    if (!tenantId) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
        });

        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        return NextResponse.json({
            name: tenant.name,
            slug: tenant.slug,
            theme: tenant.theme,
            logoUrl: tenant.logoUrl,
            settings: (tenant.settings as any) || {},
        });
    } catch (error: any) {
        console.error('Settings Fetch Error:', error);
        return NextResponse.json({ error: 'Ayarlar yüklenemedi', details: error.message }, { status: 500 });
    }
}

// POST: Update restaurant settings
export async function POST(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
        return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    const tenantId = (sessionUser as any).tenantId;
    if (!tenantId) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    try {
        const body = await request.json();

        // Extract fields to update
        // We separate core fields from JSON settings
        const {
            name,
            slug,
            subtitle,
            description,
            address,
            instagram,
            facebook,
            whatsapp,
            website,
            youtube,
            restaurantColor,
            primaryColor,
            fbPixelId,
            gaTrackingId,
            logoUrl,
            coverUrl,
            whatsappOrderEnabled,
            whatsappNumber,
            whatsappMessage,
            // Settings fields
            allowCallWaiter,
            allowOnTableOrder,
            allowTakeawayOrder,
            allowHotelOrder,
            allowDeliveryOrder,
            sendOrderNotification,
            deliveryCharge,
            timing,
            restaurant_template,
            theme // Direct theme key from branding page
        } = body;

        // Construct settings object
        const settings = {
            subtitle,
            timing,
            description, // Can be in settings or core if schema allows. Schema doesn't have description field on Tenant, so it goes to settings or we might need to check schema again. 
            // WAIT: Schema has NO description, address, social media fields on Tenant model!
            // They must be stored in the 'settings' JSON field.

            address,
            instagram,
            facebook,
            whatsapp,
            website,
            youtube,
            restaurantColor: restaurantColor || primaryColor,
            primaryColor: primaryColor || restaurantColor,
            fbPixelId,
            gaTrackingId,
            coverUrl,
            whatsappOrderEnabled,
            whatsappNumber,
            whatsappMessage,

            allowCallWaiter: allowCallWaiter === '1' || allowCallWaiter === true,
            allowOnTableOrder: allowOnTableOrder === '1' || allowOnTableOrder === true,
            allowTakeawayOrder: allowTakeawayOrder === '1' || allowTakeawayOrder === true,
            allowHotelOrder: allowHotelOrder === '1' || allowHotelOrder === true,
            allowDeliveryOrder: allowDeliveryOrder === '1' || allowDeliveryOrder === true,
            sendOrderNotification: sendOrderNotification === '1' || sendOrderNotification === true,
            deliveryCharge: deliveryCharge ? parseFloat(deliveryCharge) : 0,
        };

        const updateData: any = {
            name,
            settings,
        };

        if (logoUrl !== undefined) {
            updateData.logoUrl = logoUrl;
        }

        if (slug) {
            updateData.slug = slug;
        }

        if (restaurant_template || theme) {
            updateData.theme = restaurant_template || theme;
        }

        const updatedTenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: updateData,
        });

        return NextResponse.json({ success: true, tenant: updatedTenant });

    } catch (error: any) {
        console.error('Settings Update Error:', error);
        // Handle unique constraint violation for slug
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Bu bağlantı adresi (slug) zaten kullanımda.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Ayarlar güncellenemedi', details: error.message }, { status: 500 });
    }
}
