import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TicketManagementClient from '@/components/admin/TicketManagementClient';

export default async function BiletYonetimSayfasi() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        redirect('/login');
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser || (sessionUser as any).role !== 'SUPER_ADMIN') {
        redirect('/dashboard');
    }

    // Fetch all tickets for admin
    const tickets = await prisma.supportTicket.findMany({
        include: {
            tenant: {
                select: { name: true, slug: true, logoUrl: true }
            },
            _count: {
                select: { messages: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <TicketManagementClient
            initialTickets={JSON.parse(JSON.stringify(tickets))}
        />
    );
}
