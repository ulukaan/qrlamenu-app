"use client";
import React from 'react';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BarChart3,
    Settings,
    PlusCircle,
    Globe,
    Clock,
    X,
    Database,
    Shield,
    Layers,
    FileText,
    Server
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useSidebar } from './SidebarContext';

const SuperAdminSidebar = () => {
    const pathname = usePathname();
    const { isMobileOpen, closeMobileSidebar } = useSidebar();

    const groups = [
        {
            title: 'RESTORANLAR (TENANT)',
            items: [
                { name: 'Genel Bakış', icon: <LayoutDashboard size={18} />, href: '/super-admin' },
                { name: 'Tüm Restoranlar', icon: <Users size={18} />, href: '/super-admin/restoranlar' },
                { name: 'Yeni Restoran Ekle', icon: <PlusCircle size={18} />, href: '/super-admin/restoranlar/yeni' },
                { name: 'Tema Yönetimi', icon: <Layers size={18} />, href: '/super-admin/temalar' },
                { name: 'Domain / Slug Yönetimi', icon: <Globe size={18} />, href: '/super-admin/restoranlar/slug' },
            ]
        },
        {
            title: 'SATIŞ & MÜŞTERİ',
            items: [
                { name: 'CRM & Leadlar', icon: <Users size={18} />, href: '/super-admin/crm' },
                { name: 'Abonelik & Fatura', icon: <CreditCard size={18} />, href: '/super-admin/planlar' },
                { name: 'Ödemeler & Finans', icon: <CreditCard size={18} />, href: '/super-admin/odemeler' },
                { name: 'Trial Yönetimi', icon: <Clock size={18} />, href: '/super-admin/trial' },
            ]
        },
        {
            title: 'OPERASYON',
            items: [
                { name: 'Sistem Logları', icon: <FileText size={18} />, href: '/super-admin/logs' },
                { name: 'Sistem Kontrol Merkezi', icon: <Server size={18} />, href: '/super-admin/sistem-kontrol' },
                { name: 'Print Agent Durumu', icon: <BarChart3 size={18} />, href: '/super-admin/print-agent' },
                { name: 'Versiyon Yönetimi', icon: <Settings size={18} />, href: '/super-admin/versiyon' },
                { name: 'Global Ayarlar', icon: <Settings size={18} />, href: '/super-admin/ayarlar' },
            ]
        },
        {
            title: 'GÜVENLİK & DESTEK',
            items: [
                { name: 'Admin Kullanıcıları', icon: <Shield size={18} />, href: '/super-admin/adminler' },
                { name: 'Audit Log (Denetim)', icon: <Database size={18} />, href: '/super-admin/audit' },
                { name: 'Erişim Ayarları', icon: <Shield size={18} />, href: '/super-admin/guvenlik' },
                { name: 'Destek Merkezi', icon: <FileText size={18} />, href: '/super-admin/destek' },
            ]
        }
    ];

    const NavItem = ({ item }: { item: any }) => {
        const isActive = pathname === item.href;
        return (
            <Link
                href={item.href}
                className={`nav-item group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                onClick={closeMobileSidebar}
                style={{ textDecoration: 'none' }}
            >
                <span className={`transition-colors duration-200 ${isActive ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon}
                </span>
                <span className="text-[13px]">{item.name}</span>
                {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-orange-600 rounded-r-full" />
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={closeMobileSidebar}
                />
            )}

            <aside
                className={`sidebar fixed lg:sticky top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-50 transition-all duration-300 ease-in-out shadow-sm ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{ width: '260px' }}
            >
                <div className="p-6 pb-2 border-b border-slate-50 flex items-center justify-between mb-4">
                    <Link href="/super-admin" className="flex items-center gap-3 no-underline group">
                        <Logo size={32} />
                        <div>
                            <span className="text-xs tracking-widest font-black bg-slate-900 text-white px-2 py-0.5 rounded-md leading-none">ADMIN</span>
                        </div>
                    </Link>
                    <button onClick={closeMobileSidebar} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-8 hide-scrollbar">
                    {groups.map((group, gIdx) => (
                        <div key={gIdx} className="mb-6">
                            <h4 className="text-[10px] font-black tracking-widest text-slate-400 px-4 mb-3 uppercase">
                                {group.title}
                            </h4>
                            <div className="space-y-1">
                                {group.items.map((item, idx) => (
                                    <NavItem key={idx} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-4 pt-4 border-t border-slate-50">
                        <h4 className="text-[10px] font-black tracking-widest text-slate-400 px-4 mb-3 uppercase">SİSTEM</h4>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all no-underline font-medium"
                        >
                            <Globe size={18} className="text-slate-400" />
                            <span className="text-[13px]">Restoran Paneli</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SuperAdminSidebar;
