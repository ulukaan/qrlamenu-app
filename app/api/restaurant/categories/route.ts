import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession, isRestaurantAdmin } from '@/lib/auth';

async function getSession() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await validateSession(token);
}

async function getTenantId(session: any) {
    if (!session || !('tenantId' in session)) return null;
    return session.tenantId as string;
}

export async function GET(request: Request) {
    const session = await getSession();
    const tenantId = await getTenantId(session);
    if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const categories = await prisma.category.findMany({
            where: { tenantId },
            include: { products: { orderBy: { order: 'asc' } } },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Kategoriler alınamadı' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    const tenantId = await getTenantId(session);
    if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC: Sadece Admin kategori oluşturabilir
    if (!isRestaurantAdmin(session)) {
        return NextResponse.json({ error: 'Bu işlem için Admin yetkisi gereklidir' }, { status: 403 });
    }

    try {
        const data = await request.json();

        // Get max order for this tenant
        const maxOrder = await prisma.category.findFirst({
            where: { tenantId },
            orderBy: { order: 'desc' },
            select: { order: true }
        });

        const category = await prisma.category.create({
            data: {
                name: data.name,
                imageUrl: data.imageUrl || null,
                tenantId,
                order: (maxOrder?.order ?? -1) + 1
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Kategori oluşturulamadı' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getSession();
    const tenantId = await getTenantId(session);
    if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC: Sadece Admin kategori güncelleyebilir
    if (!isRestaurantAdmin(session)) {
        return NextResponse.json({ error: 'Bu işlem için Admin yetkisi gereklidir' }, { status: 403 });
    }

    try {
        const data = await request.json();
        const { id, name, imageUrl } = data;

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
        }

        // Verify ownership
        const existing = await prisma.category.findFirst({
            where: { id, tenantId }
        });
        if (!existing) {
            return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(imageUrl !== undefined && { imageUrl })
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Kategori güncellenemedi' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getSession();
    const tenantId = await getTenantId(session);
    if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC: Sadece Admin kategori silebilir
    if (!isRestaurantAdmin(session)) {
        return NextResponse.json({ error: 'Bu işlem için Admin yetkisi gereklidir' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
        }

        // Verify ownership
        const existing = await prisma.category.findFirst({
            where: { id, tenantId }
        });
        if (!existing) {
            return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
        }

        // Products cascade-deleted by Prisma schema
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
    }
}
