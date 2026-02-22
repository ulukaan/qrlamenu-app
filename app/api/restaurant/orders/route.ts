import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';
import { triggerRestaurantEvent } from '@/lib/pusher';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tenantId, tableId, items, totalAmount, note } = body;

        if (!tenantId || !items || !totalAmount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate tenant exists (optional but good practice)
        // const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
        // if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

        const order = await prisma.order.create({
            data: {
                tenantId,
                tableId: tableId ? String(tableId) : null, // Ensure string or null
                items,
                totalAmount: parseFloat(totalAmount),
                status: 'PENDING',
                // note: note // If we add note to schema later
            }
        });

        // Trigger Real-time Notification for Admin
        await triggerRestaurantEvent(tenantId, 'new-order', order);

        // Add CORS headers for public access if needed
        const response = NextResponse.json(order);
        response.headers.set('Access-Control-Allow-Origin', '*');

        return response;
    } catch (error) {
        console.error('Order Creation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
        return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    // Assume user is a restaurant user
    const tenantId = (sessionUser as any).tenantId;

    if (!tenantId) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to last 50 orders for performance
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
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

    try {
        const data = await request.json();

        // Ensure the order belongs to the tenant
        const existingOrder = await prisma.order.findFirst({
            where: { id: data.id, tenantId }
        });

        if (!existingOrder) {
            return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
        }

        const order = await prisma.order.update({
            where: { id: data.id },
            data: { status: data.status }
        });

        // Trigger status update notification
        await triggerRestaurantEvent(tenantId, 'order-status-update', order);

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
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

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
        }

        // Ensure the order belongs to the tenant
        const existingOrder = await prisma.order.findFirst({
            where: { id, tenantId }
        });

        if (!existingOrder) {
            return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
        }

        await prisma.order.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
