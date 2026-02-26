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

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    try {
        const products = await prisma.product.findMany({
            where: {
                tenantId,
                ...(categoryId ? { categoryId } : {})
            },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Ürünler alınamadı' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    const tenantId = await getTenantId(session);
    if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC: Sadece Admin ürün ekleyebilir
    if (!isRestaurantAdmin(session)) {
        return NextResponse.json({ error: 'Bu işlem için Admin yetkisi gereklidir' }, { status: 403 });
    }

    try {
        const data = await request.json();

        // Get max order for this category
        const maxOrder = await prisma.product.findFirst({
            where: { categoryId: data.categoryId, tenantId },
            orderBy: { order: 'desc' },
            select: { order: true }
        });

        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description || null,
                price: parseFloat(data.price),
                imageUrl: data.imageUrl || null,
                categoryId: data.categoryId,
                tenantId,
                isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
                order: (maxOrder?.order ?? -1) + 1
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Ürün oluşturulamadı' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getSession();
    const tenantId = await getTenantId(session);
    if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC: Sadece Admin ürün güncelleyebilir
    if (!isRestaurantAdmin(session)) {
        return NextResponse.json({ error: 'Bu işlem için Admin yetkisi gereklidir' }, { status: 403 });
    }

    try {
        const data = await request.json();
        const { id, name, description, price, imageUrl, isAvailable } = data;

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
        }

        // Verify ownership
        const existing = await prisma.product.findFirst({
            where: { id, tenantId }
        });
        if (!existing) {
            return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(isAvailable !== undefined && { isAvailable })
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getSession();
    const tenantId = await getTenantId(session);
    if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC: Sadece Admin ürün silebilir
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
        const existing = await prisma.product.findFirst({
            where: { id, tenantId }
        });
        if (!existing) {
            return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
        }

        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
    }
}
