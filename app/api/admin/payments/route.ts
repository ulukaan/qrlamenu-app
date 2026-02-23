import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const payments = await prisma.transaction.findMany({
            include: {
                tenant: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error('Fetch Payments Error:', error);
        return NextResponse.json({ error: 'Ödemeler alınamadı.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, amount, paymentMethod, status, tenantId } = body;

        const payment = await prisma.transaction.create({
            data: {
                title,
                amount: parseFloat(amount),
                paymentMethod,
                status,
                tenantId
            },
            include: {
                tenant: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json(payment);
    } catch (error) {
        console.error('Create Payment Error:', error);
        return NextResponse.json({ error: 'Ödeme kaydı oluşturulamadı.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'İşlem ID belirtilmedi.' }, { status: 400 });
        }

        await prisma.transaction.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Payment Error:', error);
        return NextResponse.json({ error: 'İşlem silinemedi.' }, { status: 500 });
    }
}
