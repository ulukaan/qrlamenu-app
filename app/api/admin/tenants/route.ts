import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mail';

export async function GET() {
    try {
        const tenants = await prisma.tenant.findMany({
            include: {
                plan: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(tenants);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const unhashedPassword = data.password || '123456';
        const hashedPassword = await hashPassword(unhashedPassword);

        const newTenant = await prisma.tenant.create({
            data: {
                name: data.name,
                slug: data.slug,
                ownerEmail: data.ownerEmail || 'info@qrlamenu.com',
                planId: data.planId,
                status: 'ACTIVE',
                trialExpiresAt: data.isTrial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
                users: {
                    create: {
                        email: data.ownerEmail || 'info@qrlamenu.com',
                        password: hashedPassword,
                        name: 'Restoran Yöneticisi',
                        role: 'ADMIN'
                    }
                }
            }
        });

        // Hoş geldiniz e-postasını gönder (Arka planda çalışır, isteği bekletmez)
        sendWelcomeEmail(data.ownerEmail || 'info@qrlamenu.com', unhashedPassword, data.name).catch(e => console.error('Welcome Email Error:', e));

        // Trigger sidebar update for admin
        const { triggerEvent } = await import('@/lib/pusher');
        await triggerEvent('admin-notifications', 'update-tenant-count', {});

        return NextResponse.json(newTenant);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Kayıt oluşturulamadı' }, { status: 500 });
    }
}
