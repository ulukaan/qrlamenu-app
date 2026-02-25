import SuperAdminSidebar from "@/components/SuperAdminSidebar";
import { SidebarProvider } from "@/components/SidebarContext";
import MobileHeader from "@/components/MobileHeader";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value || cookieStore.get('auth_token')?.value;
    const session = token ? await validateSession(token) : null;

    if (!session || session.role !== 'SUPER_ADMIN') {
        redirect('/login?reason=admin_required');
    }

    return (
        <SidebarProvider>
            <div className="flex bg-[#f8fafc]" style={{ height: '100dvh', width: '100%' }}>
                <SuperAdminSidebar />
                <main className="main-content relative flex flex-col flex-1 h-full overflow-hidden">
                    <MobileHeader />
                    <div className="flex-1 overflow-y-auto relative z-0 w-full" id="admin-scroll-area">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
