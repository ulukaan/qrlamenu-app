
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// GET: Fetch a single theme
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const theme = await prisma.theme.findUnique({
            where: { id: params.id },
        });
        if (!theme) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }
        return NextResponse.json(theme);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
    }
}

// PUT: Update a theme
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { key, name, description, previewUrl, isPremium, isActive, order } = body;

        const theme = await prisma.theme.update({
            where: { id: params.id },
            data: {
                key,
                name,
                description,
                previewUrl,
                isPremium,
                isActive,
                order,
            },
        });
        return NextResponse.json(theme);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
    }
}

// DELETE: Delete a theme
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.theme.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
    }
}
