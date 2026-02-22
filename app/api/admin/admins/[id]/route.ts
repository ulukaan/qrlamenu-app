import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { name, role, emailVerified, password } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;
        if (emailVerified !== undefined) updateData.emailVerified = emailVerified ? new Date() : null;
        if (password) updateData.password = password; // Will be auto-hashed on next login

        const updated = await prisma.superAdmin.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update Admin Error:', error);
        return NextResponse.json({ error: 'Admin güncellenirken bir hata oluştu.' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        // Prevent self-deletion if we had session context here, 
        // but for now let's implement basic deletion.
        await prisma.superAdmin.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Admin Error:', error);
        return NextResponse.json({ error: 'Admin silinirken bir hata oluştu.' }, { status: 500 });
    }
}
