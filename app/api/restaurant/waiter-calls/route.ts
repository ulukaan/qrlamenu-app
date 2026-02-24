import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { triggerRestaurantEvent } from '@/lib/pusher';
import { checkTenantLimits, hasFeature } from '@/lib/limits';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tenantId, tableId } = body;

        if (!tenantId || !tableId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Limit ve Tema/Özellik kontrolü
        const limitCheck = await checkTenantLimits(tenantId);
        if (!limitCheck.allowed) {
            return NextResponse.json({ error: limitCheck.reason }, { status: 403 });
        }

        if (!hasFeature(limitCheck.limits, 'Garson Çağrı Sistemi')) {
            return NextResponse.json({ error: 'Bu restoranın abonelik planı Garson Çağrısı özelliğini desteklemiyor.' }, { status: 403 });
        }

        const call = await prisma.waiterCall.create({
            data: {
                tenantId,
                tableId,
                status: 'PENDING'
            }
        });

        // Trigger Real-time Notification
        await triggerRestaurantEvent(tenantId, 'new-waiter-call', call);

        // Add proper CORS headers for the client-side simulation
        const response = NextResponse.json(call);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    } catch (error) {
        console.error('Error creating waiter call:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const calls = await prisma.waiterCall.findMany({
            where: {
                tenantId: (session as any).tenantId,
                // status: 'PENDING' // Optionally filter
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(calls);
    } catch (error) {
        console.error('Error fetching waiter calls:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const call = await prisma.waiterCall.updateMany({
            where: {
                id,
                tenantId: (session as any).tenantId // Security check
            },
            data: { status }
        });

        return NextResponse.json(call);
    } catch (error) {
        console.error('Error updating waiter call:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
