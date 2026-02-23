import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { cookies } from "next/headers";

const CONFIG_KEY = "WEBSITE_CONTENT";

async function checkAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get("auth-token")?.value || cookieStore.get("auth_token")?.value;

    if (!token) {
        console.warn("CMS API: No token found in cookies. Available cookies:", cookieStore.getAll().map(c => c.name));
        return null;
    }

    try {
        const session = await validateSession(token);
        if (!session) {
            console.warn("CMS API: Invalid or expired session for token.");
            return null;
        }

        if (session.role !== "SUPER_ADMIN") {
            console.warn(`CMS API: Unauthorized role - ${session.role} (User: ${session.id})`);
            return null;
        }

        return session;
    } catch (error) {
        console.error("CMS API Auth Check Internal Error:", error);
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const config = await prisma.systemConfig.findUnique({
            where: { key: CONFIG_KEY }
        });

        return NextResponse.json(config?.value || null);
    } catch (error) {
        console.error("Website Config GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await checkAuth();
        if (!session) {
            console.error("CMS API POST: Unauthorized access attempt or session expired.");
            return NextResponse.json({
                error: "Unauthorized",
                details: "Oturumunuzun süresi dolmuş olabilir. Lütfen sayfayı yenileyip tekrar giriş yapın."
            }, { status: 401 });
        }

        const body = await req.json();

        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: "Geçersiz veri formatı" }, { status: 400 });
        }

        // Veriyi SystemConfig tablosuna kaydet veya güncelle
        const updatedConfig = await prisma.systemConfig.upsert({
            where: { key: CONFIG_KEY },
            update: { value: body },
            create: { key: CONFIG_KEY, value: body }
        });

        console.log(`CMS API POST: Config updated successfully by ${session.id}`);
        return NextResponse.json(updatedConfig.value);
    } catch (error: any) {
        console.error("Website Config POST Error:", error);
        return NextResponse.json({
            error: "Sistem Hatası",
            details: error?.message || "Beklenmedik bir hata oluştu."
        }, { status: 500 });
    }
}
