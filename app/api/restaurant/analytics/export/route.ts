import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

export async function GET(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return new Response('Unauthorized', { status: 401 });

    const sessionUser = await validateSession(token);
    if (!sessionUser) return new Response('Unauthorized', { status: 401 });

    const tenantId = (sessionUser as any).tenantId;

    try {
        const orders = await (prisma as any).order.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' }
        });

        // CSV Header
        let csv = 'Sipariş ID,Masa,Tutar,Durum,Tarih,Ürünler\n';

        orders.forEach((order: any) => {
            const date = new Date(order.createdAt).toLocaleString('tr-TR');
            const items = order.items as any;
            const itemNames = Object.values(items || {}).map((it: any) => `${it.name}(${it.quantity})`).join('; ');

            csv += `${order.id},${order.tableId || '-'},${order.totalAmount},${order.status},"${date}","${itemNames}"\n`;
        });

        // Return as file download
        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="siparisler_${new Date().toISOString().split('T')[0]}.csv"`
            }
        });

    } catch (error) {
        console.error('Export Error:', error);
        return new Response('Export failed', { status: 500 });
    }
}
