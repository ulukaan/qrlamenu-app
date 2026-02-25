import React from "react";
import SuperAdminSidebar from "@/components/SuperAdminSidebar";
import { SidebarProvider } from "@/components/SidebarContext";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex bg-[#f8fafc]" style={{ height: '100dvh', width: '100%' }}>
                <SuperAdminSidebar />
                <main className="main-content relative flex flex-col flex-1 h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto relative z-0 w-full" id="admin-scroll-area">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
