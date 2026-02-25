import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SupportCenterClient from '@/components/restaurant/SupportCenterClient';

export default async function DestekSayfasi() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        redirect('/login');
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
        redirect('/login');
    }

    const tenantId = (sessionUser as any).tenantId;
    if (!tenantId) {
        redirect('/dashboard');
    }

    // Fetch tickets for initial load
    const tickets = await prisma.supportTicket.findMany({
        where: { tenantId },
        include: {
            _count: {
                select: { messages: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <SupportCenterClient
            initialTickets={JSON.parse(JSON.stringify(tickets))}
            tenantName={(sessionUser as any).tenant?.name || 'Restoran'}
            tenantId={tenantId}
        />
    );
}
