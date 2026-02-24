import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { price: 'asc' }
        });
        return NextResponse.json(plans);
    } catch (error) {
        console.error('Planları çekerken hata:', error);
        return NextResponse.json({ error: 'Planlar alınamadı.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
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
