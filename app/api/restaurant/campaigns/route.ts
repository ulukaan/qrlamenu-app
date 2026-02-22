import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

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
        const campaigns = await (prisma as any).campaign.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

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

    try {
        const body = await request.json();
        console.log('Campaign POST body:', body);

        // Check if campaign model exists in prisma client
        if (!(prisma as any).campaign) {
            console.error('Prisma Error: Campaign model not found in Prisma Client.');
            return NextResponse.json({
                error: 'Prisma client out of sync',
                details: 'Campaign model is missing in generated Prisma client. Please stop the dev server and run "npx prisma generate".'
            }, { status: 500 });
        }
        console.log('Campaign POST sessionUser:', sessionUser);

        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant ID is missing in session' }, { status: 400 });
        }

        const { startDate, endDate, ...rest } = body;

        const campaign = await (prisma as any).campaign.create({
            data: {
                ...rest,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                tenantId
            }
        });
        return NextResponse.json(campaign);
    } catch (error: any) {
        console.error('Campaign creation error:', error);
        return NextResponse.json({
            error: 'Failed to create campaign',
            details: error.message,
            code: error.code
        }, { status: 500 });
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
        const { id, startDate, endDate, ...updateData } = data;

        if (!(prisma as any).campaign) {
            return NextResponse.json({
                error: 'Prisma client out of sync',
                details: 'Campaign model is missing in generated Prisma client. Please stop the dev server and run "npx prisma generate".'
            }, { status: 500 });
        }

        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant ID is missing in session' }, { status: 400 });
        }

        // Ensure ownership
        const existing = await (prisma as any).campaign.findFirst({
            where: { id, tenantId }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const campaign = await (prisma as any).campaign.update({
            where: { id },
            data: {
                ...updateData,
                startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
                endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
            }
        });

        return NextResponse.json(campaign);
    } catch (error: any) {
        console.error('Campaign update error:', error);
        return NextResponse.json({
            error: 'Failed to update campaign',
            details: error.message
        }, { status: 500 });
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

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const existing = await (prisma as any).campaign.findFirst({
            where: { id, tenantId }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        await (prisma as any).campaign.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
    }
}
