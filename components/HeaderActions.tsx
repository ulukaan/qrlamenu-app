"use client";
import React, { useState, useEffect, useRef } from 'react';
import { User, Menu, Settings, Store, LogOut, ChevronDown } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export const MobileMenuToggle = () => {
    const { toggleMobileSidebar } = useSidebar();
    return (
        <button
            onClick={toggleMobileSidebar}
            className="h-9 px-3 rounded-[6px] bg-white border border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300 text-slate-700 lg:hidden transition-all shadow-sm flex-shrink-0 flex items-center justify-center"
        >
            <Menu size={18} strokeWidth={2} />
        </button>
    );
};

export const ProfileDropdown = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data?.user) {
                    setUser({ name: data.user.name || 'Restoran Müdürü', email: data.user.email });
                }
            })
            .catch(console.error);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        }
    };

    return (
        <div className="relative z-[60] flex-shrink-0" ref={dropdownRef}>
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 h-9 px-3 rounded-[6px] border transition-all duration-200 shadow-sm ${isProfileOpen
                    ? 'bg-slate-50 border-orange-500'
                    : 'bg-white border-[#E2E8F0] hover:border-slate-400'
                    }`}
            >
                <div className="w-6 h-6 rounded-[4px] bg-slate-900 flex items-center justify-center text-white overflow-hidden shadow-inner">
                    <User size={12} strokeWidth={2.5} />
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-[12px] font-bold text-slate-900 leading-none truncate max-w-[120px] tracking-tight">
                        {user?.name || 'Yükleniyor...'}
                    </p>
                </div>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-[120%] w-56 bg-white rounded-[6px] shadow-xl border border-[#E2E8F0] overflow-hidden"
                    >
                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <p className="text-[13px] font-bold text-slate-900 leading-none">{user?.name}</p>
                            <p className="text-[11px] font-medium text-slate-400 truncate mt-1.5">{user?.email}</p>
                        </div>
                        <div className="p-1">
                            <Link href="/hesap-ayarlari" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-[4px] transition-colors">
                                <Settings size={14} /> Hesap Ayarları
                            </Link>
                            <Link href="/restoran-bilgileri" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-[4px] transition-colors">
                                <Store size={14} /> Restoran Bilgileri
                            </Link>
                            <div className="h-px bg-slate-100 my-1 mx-1"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50 rounded-[4px] transition-colors text-left">
                                <LogOut size={14} /> Çıkış Yap
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
