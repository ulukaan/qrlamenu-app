import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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
            <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
                <Sidebar />
                <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <ExpiryBanner />
                    <VerificationBanner />
                    <Header />
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {children}
                    </div>
                    <WhatsAppButton />
                </main>
            </div>
        </SidebarProvider>
    );
}
