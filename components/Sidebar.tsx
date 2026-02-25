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

    const menuGroups = [
        {
            title: 'OPERASYON',
            items: [
                { name: 'Gösterge Paneli', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
                { name: 'Analizler', icon: <BarChart3 size={18} />, href: '/dashboard/analytics' },
                { name: 'Siparişler', icon: <ShoppingBag size={18} />, href: '/siparisler' },
            ]
        },
        {
            title: 'KATALOG',
            items: [
                { name: 'Menü & Kategoriler', icon: <PlusSquare size={18} />, href: '/menu-ekle' },
                { name: 'QR Oluşturucu', icon: <QrCode size={18} />, href: '/qr-olusturucu' },
                { name: 'Veri Yönetimi', icon: <Download size={18} />, href: '/import-export' },
            ]
        },
        {
            title: 'PAZARLAMA',
            items: [
                { name: 'Kampanyalar', icon: <Megaphone size={18} />, href: '/kampanyalar' },
                { name: 'WhatsApp Siparişi', icon: <MessageSquare size={18} />, href: '/whatsapp-siparisi' },
                { name: 'Markalaşma & Pixel', icon: <Palette size={18} />, href: '/ayarlar/markalasma' },
            ]
        },
        {
            title: 'SİSTEM',
            items: [
                { name: 'Restoran Bilgileri', icon: <Store size={18} />, href: '/restoran-bilgileri' },
                { name: 'Üyelik Planı', icon: <Zap size={18} />, href: '/uyelik-plan-ayarlari' },
                { name: 'İşlem Geçmişi', icon: <FileText size={18} />, href: '/islemler' },
                { name: 'Hesap Ayarları', icon: <Settings size={18} />, href: '/hesap-ayarlari' },
            ]
        }
    ];

    const NavItem = ({ item }: { item: any }) => {
        const isActive = pathname === item.href;

        return (
            <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 h-9 rounded-[6px] transition-all duration-200 group relative ${isActive
                        ? 'bg-orange-500/10 text-orange-600'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                style={{ textDecoration: 'none' }}
                onClick={closeMobileSidebar}
            >
                <span className={`transition-colors ${isActive ? 'text-orange-600' : 'group-hover:text-slate-900'}`}>
                    {item.icon}
                </span>
                <span className={`text-[13px] font-bold tracking-tight ${isActive ? 'text-orange-600' : ''}`}>
                    {item.name}
                </span>
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* Sidebar Container */}
            <div className={`sidebar w-[270px] h-screen bg-white border-r border-slate-200/60 flex flex-col fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="px-6 py-6 flex items-center justify-between border-b border-slate-50">
                    <Link href="/dashboard" className="transition-opacity hover:opacity-80">
                        <Logo size={28} />
                    </Link>
                    <button onClick={closeMobileSidebar} className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto mt-4 flex flex-col scrollbar-hide">
                    <nav className="flex-1 px-4 pb-8">
                        {menuGroups.map((group, gIdx) => (
                            <div key={gIdx} className={gIdx !== 0 ? 'mt-8' : ''}>
                                <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">
                                    {group.title}
                                </p>
                                <div className="space-y-1">
                                    {group.items.map((item, idx) => (
                                        <NavItem key={idx} item={item} />
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="mt-10 pt-6 border-t border-slate-50">
                            <div
                                onClick={async () => {
                                    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
                                        await fetch('/api/auth/logout', { method: 'POST' });
                                        window.location.href = '/login';
                                    }
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-[6px] text-rose-500 hover:bg-rose-50 transition-all cursor-pointer group"
                            >
                                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[13px] font-bold tracking-tight">Güvenli Çıkış</span>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
