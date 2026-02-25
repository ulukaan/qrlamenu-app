import React from "react";
import Sidebar from "@/components/Sidebar";
import VerificationBanner from "@/components/VerificationBanner";
import ExpiryBanner from "@/components/admin/ExpiryBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SidebarProvider } from "@/components/SidebarContext";

export default function RestaurantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex bg-[#f8fafc]" style={{ height: '100dvh', width: '100%' }}>
                <Sidebar />
                <main className="main-content relative flex flex-col flex-1 h-full overflow-hidden">
                    <div className="flex-shrink-0 z-[60] relative">
                        <ExpiryBanner />
                        <VerificationBanner />
                    </div>

                    <div className="flex-1 overflow-y-auto relative z-0 w-full" id="main-scroll-area">
                        {children}
                    </div>
                    <WhatsAppButton />
                </main>
            </div>
        </SidebarProvider>
    );
}
