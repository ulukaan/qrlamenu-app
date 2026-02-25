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
    Server,
    LifeBuoy,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useSidebar } from './SidebarContext';
import { useState, useEffect } from 'react';

const SuperAdminSidebar = () => {
    const pathname = usePathname();
    const { isMobileOpen, closeMobileSidebar } = useSidebar();
    const [ticketCount, setTicketCount] = useState<number>(0);
    const [tenantCount, setTenantCount] = useState<number>(0);

    useEffect(() => {
        const { getPusherClient } = require('@/lib/pusher-client');
        const pusher = getPusherClient();

        const fetchTicketCount = async () => {
            try {
                const res = await fetch('/api/admin/tickets/count');
                const data = await res.json();
                if (data.count !== undefined) {
                    setTicketCount(data.count);
                }
            } catch (error) {
                console.error('Error fetching ticket count:', error);
            }
        };

        const fetchTenantCount = async () => {
            try {
                const res = await fetch('/api/admin/tenants/count');
                const data = await res.json();
                if (data.count !== undefined) {
                    setTenantCount(data.count);
                }
            } catch (error) {
                console.error('Error fetching tenant count:', error);
            }
        };

        fetchTicketCount();
        fetchTenantCount();

        if (pusher) {
            const channel = pusher.subscribe('admin-notifications');
            channel.bind('new-ticket', fetchTicketCount);
            channel.bind('update-count', fetchTicketCount);
            channel.bind('update-tenant-count', fetchTenantCount);

            return () => {
                pusher.unsubscribe('admin-notifications');
            };
        }
    }, []);

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
                { name: 'Website Yönetimi', icon: <Globe size={18} />, href: '/super-admin/website' },
                { name: 'Audit Log (Denetim)', icon: <Database size={18} />, href: '/super-admin/audit' },
                { name: 'Erişim Ayarları', icon: <Shield size={18} />, href: '/super-admin/guvenlik' },
                { name: 'Bilet Yönetimi', icon: <LifeBuoy size={18} />, href: '/super-admin/bilet-yonetimi' },
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

                {item.href === '/super-admin/bilet-yonetimi' && ticketCount > 0 && (
                    <span className="ml-auto bg-orange-500 text-white text-[10px] font-black px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                        {ticketCount > 99 ? '99+' : ticketCount}
                    </span>
                )}

                {item.href === '/super-admin/restoranlar' && tenantCount > 0 && (
                    <span className="ml-auto bg-slate-900 text-white text-[10px] font-black px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                        {tenantCount > 99 ? '99+' : tenantCount}
                    </span>
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
                className={`sidebar w-[270px] h-screen bg-white border-r border-slate-200/60 flex flex-col fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="px-6 py-6 flex items-center justify-between border-b border-slate-50">
                    <Link href="/super-admin" className="transition-opacity hover:opacity-80 flex items-center gap-3 no-underline">
                        <Logo size={28} />
                        <span className="text-[10px] tracking-widest font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-[4px] leading-none">ADMIN</span>
                    </Link>
                    <button onClick={closeMobileSidebar} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto mt-4 flex flex-col scrollbar-hide">
                    <nav className="flex-1 px-4 pb-8">
                        {groups.map((group, gIdx) => (
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

                        <div className="mt-8">
                            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">SİSTEM</p>
                            <div className="space-y-1">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 px-4 h-9 rounded-[6px] text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all no-underline"
                                >
                                    <Globe size={18} className="text-slate-400 group-hover:text-slate-900" />
                                    <span className="text-[13px] font-bold tracking-tight">Restoran Paneli</span>
                                </Link>
                            </div>
                        </div>

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
            </aside>
        </>
    );
};

export default SuperAdminSidebar;
