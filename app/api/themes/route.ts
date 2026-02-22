
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET: List active themes (for public/restaurant use)
export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(themes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }
}
