import React from "react";
import SuperAdminSidebar from "@/components/SuperAdminSidebar";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/SidebarContext";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#f8f9fb]">
                <SuperAdminSidebar />
                <main className="main-content flex-1 flex flex-col min-h-screen">
                    <Header />
                    <div className="flex-1 overflow-y-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
