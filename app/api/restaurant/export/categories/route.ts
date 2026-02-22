
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const session = await validateSession(token);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const tenantId = (session as any).tenantId;
    if (!tenantId) {
        return new NextResponse("Tenant ID not found", { status: 400 });
    }

    try {
        const categories = await prisma.category.findMany({
            where: { tenantId },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                name: true,
                order: true,
            }
        });

        // CSV Header
        let csv = "ID,Name,Order\n";

        // CSV Rows
        categories.forEach(cat => {
            const row = [
                cat.id,
                `"${cat.name.replace(/"/g, '""')}"`, // Escape quotes
                cat.order
            ];
            csv += row.join(",") + "\n";
        });

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="categories.csv"',
            },
        });

    } catch (error) {
        console.error("Export Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
