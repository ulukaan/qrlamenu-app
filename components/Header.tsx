"use client";
import React, { useState, useEffect, useRef } from 'react';
import { User, Menu, Settings, Store, LogOut, ChevronDown } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Header = () => {
    const { toggleMobileSidebar } = useSidebar();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch user data
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data?.user) {
                    setUser({
                        name: data.user.name || 'Restoran Müdürü',
                        email: data.user.email
                    });
                }
            })
            .catch(console.error);

        // Click outside handler
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
        <header className="header px-4 lg:px-8 py-0 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30 h-[70px]">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileSidebar}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-3 p-1.5 pr-3 rounded-md border transition-all duration-200 ${isProfileOpen
                        ? 'bg-slate-50 border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-400'
                        }`}
                >
                    <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white overflow-hidden">
                        <User size={14} />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-[10px] font-black text-slate-900 leading-tight truncate max-w-[120px] uppercase tracking-wider">
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
                            className="absolute right-0 top-[120%] w-56 bg-white rounded-md shadow-xl border border-slate-200 overflow-hidden"
                        >
                            {/* Dropdown Header */}
                            <div className="p-4 bg-slate-50 border-b border-slate-100">
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{user?.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 truncate mt-1.5">{user?.email}</p>
                            </div>

                            {/* Dropdown Actions */}
                            <div className="p-1">
                                <Link
                                    href="/hesap-ayarlari"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-[10px] font-black text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors uppercase tracking-widest"
                                >
                                    <Settings size={14} />
                                    Hesap Ayarları
                                </Link>
                                <Link
                                    href="/restoran-bilgileri"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-[10px] font-black text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors uppercase tracking-widest"
                                >
                                    <Store size={14} />
                                    Restoran Bilgileri
                                </Link>
                                <div className="h-px bg-slate-100 my-1 mx-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black text-red-600 hover:bg-red-50 rounded-md transition-colors text-left uppercase tracking-widest"
                                >
                                    <LogOut size={14} />
                                    Çıkış Yap
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;
