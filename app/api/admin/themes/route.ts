
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET: List all themes (for admin dashboard)
export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(themes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }
}

// POST: Create a new theme
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key, name, description, previewUrl, isPremium, isActive, order } = body;

        const theme = await prisma.theme.create({
            data: {
                key,
                name,
                description,
                previewUrl,
                isPremium: isPremium || false,
                isActive: isActive !== undefined ? isActive : true,
                order: order || 0,
            },
        });
        return NextResponse.json(theme);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
    }
}
