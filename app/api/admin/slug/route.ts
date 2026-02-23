import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const tenants = await prisma.tenant.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                customDomain: true,
                status: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(tenants);
    } catch (error) {
        console.error('Fetch Slug/Domain Error:', error);
        return NextResponse.json({ error: 'Domain verileri alınamadı.' }, { status: 500 });
    }
}
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, slug, customDomain } = body;

        if (!id) return NextResponse.json({ error: 'Tenant ID gerekli' }, { status: 400 });

        // Slug format kontrolü (opsiyonel ama önerilir)
        if (slug) {
            const slugRegex = /^[a-z0-9-]+$/;
            if (!slugRegex.test(slug)) {
                return NextResponse.json({ error: 'Geçersiz slug formatı. Sadece küçük harf, sayı ve tire kullanın.' }, { status: 400 });
            }

            // Slug benzersiz mi kontrol et
            const existing = await prisma.tenant.findFirst({
                where: {
                    slug,
                    id: { not: id }
                }
            });
            if (existing) {
                return NextResponse.json({ error: 'Bu slug zaten başka bir restoran tarafından kullanılıyor.' }, { status: 400 });
            }
        }

        const updated = await prisma.tenant.update({
            where: { id },
            data: {
                slug: slug || undefined,
                customDomain: customDomain !== undefined ? customDomain : undefined
            }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('Update Slug/Domain Error:', error);
        return NextResponse.json({ error: 'Güncelleme sırasında hata oluştu.' }, { status: 500 });
    }
}
