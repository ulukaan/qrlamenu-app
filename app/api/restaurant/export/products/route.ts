
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
        const products = await prisma.product.findMany({
            where: { tenantId },
            include: { category: true },
            orderBy: { order: 'asc' }
        });

        // CSV Header
        let csv = "ID,Name,Description,Price,Category,Order,IsAvailable\n";

        // CSV Rows
        products.forEach(p => {
            const description = p.description ? `"${p.description.replace(/"/g, '""')}"` : "";
            const categoryName = p.category ? `"${p.category.name.replace(/"/g, '""')}"` : "";

            const row = [
                p.id,
                `"${p.name.replace(/"/g, '""')}"`,
                description,
                p.price,
                categoryName,
                p.order,
                p.isAvailable ? "Yes" : "No"
            ];
            csv += row.join(",") + "\n";
        });

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="products.csv"',
            },
        });

    } catch (error) {
        console.error("Export Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
