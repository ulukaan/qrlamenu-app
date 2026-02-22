import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

        const newAdmin = await prisma.superAdmin.create({
            data: {
                email,
                password, // Will be hashed via auth logic on first login
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
