import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (token) {
        await prisma.session.deleteMany({
            where: { token },
        });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('auth-token');

    return response;
}
