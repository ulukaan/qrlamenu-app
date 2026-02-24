import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET() {
    try {
        const admins = await prisma.superAdmin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                emailVerified: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(admins);
    } catch (error) {
        console.error('Fetch Admins Error:', error);
        return NextResponse.json({ error: 'Admin kullanıcıları alınamadı.' }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, role } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'E-posta ve şifre gereklidir.' }, { status: 400 });
        }

        const existing = await prisma.superAdmin.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda.' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const newAdmin = await prisma.superAdmin.create({
            data: {
                email,
                password: hashedPassword, // Hashed via pbkdf2
                name: name || '',
                role: role || 'SUPER_ADMIN'
            }
        });

        return NextResponse.json(newAdmin);
    } catch (error) {
        console.error('Create Admin Error:', error);
        return NextResponse.json({ error: 'Admin oluşturulurken bir hata oluştu.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID gereklidir.' }, { status: 400 });

        await prisma.superAdmin.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Silinirken hata oluştu.' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, name, email, password, role } = body;

        if (!id) return NextResponse.json({ error: 'ID gereklidir.' }, { status: 400 });

        const updateData: any = { name, email, role };

        if (password) {
            updateData.password = await hashPassword(password);
        }

        const updated = await prisma.superAdmin.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Güncellenirken hata oluştu.' }, { status: 500 });
    }
}
