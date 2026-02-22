import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: {
                price: 'asc'
            }
        });
        return NextResponse.json(plans);
    } catch (error: any) {
        console.error('API Plans GET Error:', error);
        return NextResponse.json({
            error: error.message,
            stack: error.stack,
            code: error.code
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const plan = await prisma.subscriptionPlan.create({
            data
        });
        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Paket oluşturulamadı' }, { status: 500 });
    }
}
