"use client";
import React from 'react';
import {
    LayoutDashboard,
    Store,
    PlusSquare,
    ShoppingBag,
    Zap,
    QrCode,
    Download,
    MessageSquare,
    FileText,
    Settings,
    LogOut,
    X,
    Megaphone,
    BarChart3,
    Palette
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useSidebar } from './SidebarContext';

const Sidebar = () => {
    const pathname = usePathname();
    const { isMobileOpen, closeMobileSidebar } = useSidebar();

    const managementItems = [
        { name: 'Gösterge Paneli', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
        { name: 'Analizler', icon: <BarChart3 size={20} />, href: '/dashboard/analytics' },
        { name: 'Restoran Bilgileri', icon: <Store size={20} />, href: '/restoran-bilgileri' },
        { name: 'Markalaşma & Pixel', icon: <Palette size={20} />, href: '/ayarlar/markalasma' },
        { name: 'Menü Ekle', icon: <PlusSquare size={20} />, href: '/menu-ekle' },
        { name: 'Siparişler', icon: <ShoppingBag size={20} />, href: '/siparisler' },
        { name: 'Üyelik Plan Ayarları', icon: <Zap size={20} />, href: '/uyelik-plan-ayarlari' },
        { name: 'QR Oluşturucu', icon: <QrCode size={20} />, href: '/qr-olusturucu' },
        { name: 'Import / Export', icon: <Download size={20} />, href: '/import-export' },
        { name: 'WhatsApp Siparişi', icon: <MessageSquare size={20} />, href: '/whatsapp-siparisi' },
        { name: 'Kampanyalar', icon: <Megaphone size={20} />, href: '/kampanyalar' },
    ];

    const accountItems = [
        { name: 'İşlemler', icon: <FileText size={20} />, href: '/islemler' },
        { name: 'Hesap ayarları', icon: <Settings size={20} />, href: '/hesap-ayarlari' },
        { name: 'Çıkış Yap', icon: <LogOut size={20} />, href: '/logout' },
    ];

    const NavItem = ({ item }: { item: any }) => {
        const isActive = pathname === item.href;

        if (item.href === '/logout') {
            return (
                <div
                    onClick={async () => {
                        if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/login';
                        }
                    }}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                    {item.icon}
                    <span>{item.name}</span>
                </div>
            );
        }

        return (
            <Link
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ textDecoration: 'none' }}
                onClick={closeMobileSidebar} // Close sidebar on mobile when link clicked
            >
                {item.icon}
                <span>{item.name}</span>
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* Sidebar Container */}
            <div className={`sidebar w-[250px] h-screen bg-white border-r border-slate-100 flex flex-col fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div style={{ padding: '1.2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <Logo size={35} />
                    </Link>
                    {/* Close Button for Mobile */}
                    <button onClick={closeMobileSidebar} className="lg:hidden text-slate-500">
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem' }}>
                    <p className="section-title">Yönetim</p>
                    {managementItems.map((item, idx) => (
                        <NavItem key={idx} item={item} />
                    ))}

                    <p className="section-title" style={{ marginTop: '1rem' }}>Hesap</p>
                    {accountItems.map((item, idx) => (
                        <NavItem key={idx} item={item} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
