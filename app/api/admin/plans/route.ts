import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession, isSuperAdmin } from '@/lib/auth';

async function checkAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const session = await validateSession(token);
    if (!isSuperAdmin(session)) return null;
    return session;
}

export async function GET() {
    const session = await checkAuth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let plans = await prisma.subscriptionPlan.findMany({
            orderBy: { price: 'asc' }
        });

        const defaultPlans = [
            { name: 'Ücretsiz', code: 'free', price: 0, branchLimit: 1, tableLimit: 10, features: ['Temel QR Menü', '50 Ürün Limiti', 'Dijital Menü Görünümü'] },
            { name: 'Başlangıç', code: 'starter', price: 590, branchLimit: 1, tableLimit: 25, features: ['Sınırsız Ürün', 'Masa Takibi', 'Günlük Ciro Raporu'] },
            { name: 'Profesyonel', code: 'pro', price: 1290, branchLimit: 1, tableLimit: 100, features: ['Garson Çağrı Sistemi', 'Gelişmiş Analiz', 'Premium Tema'] },
            { name: 'Growth+', code: 'growth', price: 1990, branchLimit: 3, tableLimit: 300, features: ['Stok Takibi', 'Çoklu Kasa', 'Şube Altyapısı'] },
            { name: 'Premium', code: 'premium', price: 2990, branchLimit: 10, tableLimit: 1000, features: ['Tüm Özellikler Dahil', 'Branding Opsiyonları', '7/24 Öncelikli Destek'] },
            { name: 'Kurumsal / VIP', code: 'enterprise', price: 5990, branchLimit: 999, tableLimit: 999, features: ['White Label', 'SLA Garantisi', 'ERP Entegrasyonu'] }
        ];

        for (const p of defaultPlans) {
            await prisma.subscriptionPlan.upsert({
                where: { code: p.code },
                update: {
                    name: p.name,
                    price: p.price,
                    branchLimit: p.branchLimit,
                    tableLimit: p.tableLimit,
                    features: p.features
                },
                create: p
            });
        }

        plans = await prisma.subscriptionPlan.findMany({
            orderBy: { price: 'asc' }
        });

        return NextResponse.json(plans);
    } catch (error) {
        console.error('Planları çekerken hata:', error);
        return NextResponse.json({ error: 'Planlar alınamadı.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await checkAuth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Yeni plan oluştururken özelliklerin (features) array gelmesini bekle, 
        // string gelirse ya da yoksa [] olarak ayarla.
        let featuresArr = body.features;
        if (typeof featuresArr === 'string') {
            featuresArr = featuresArr.split('\n').filter((f: string) => f.trim() !== '');
        } else if (!Array.isArray(featuresArr)) {
            featuresArr = [];
        }

        const newPlan = await prisma.subscriptionPlan.create({
            data: {
                name: body.name || 'Yeni Plan',
                code: body.code || `plan_${Date.now()} `,
                price: parseFloat(body.price) || 0,
                branchLimit: parseInt(body.branchLimit) || 1,
                tableLimit: parseInt(body.tableLimit) || 10,
                features: featuresArr,
            }
        });
        return NextResponse.json(newPlan);
    } catch (error) {
        console.error('Plan oluşturulurken hata:', error);
        return NextResponse.json({ error: 'Plan oluşturulamadı.' }, { status: 500 });
    }
}
