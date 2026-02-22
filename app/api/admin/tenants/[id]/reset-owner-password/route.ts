import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json({ error: 'Yeni şifre gereklidir.' }, { status: 400 });
        }

        // Find the owner user of this tenant
        const tenant = await prisma.tenant.findUnique({
            where: { id: params.id }
        });

        if (!tenant) {
            return NextResponse.json({ error: 'Restoran bulunamadı.' }, { status: 404 });
        }

        const owner = await prisma.user.findFirst({
            where: {
                tenantId: params.id,
                email: tenant.ownerEmail
            }
        });

        if (!owner) {
            return NextResponse.json({ error: 'Restoran sahibi kullanıcı hesabı bulunamadı.' }, { status: 404 });
        }

        await prisma.user.update({
            where: { id: owner.id },
            data: {
                password // Will be auto-hashed on first login via auth logic
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reset Owner Password Error:', error);
        return NextResponse.json({ error: 'Şifre sıfırlanırken hata oluştu.' }, { status: 500 });
    }
}
