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
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-200 ${isProfileOpen
                            ? 'bg-orange-50 border-orange-200 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50'
                        }`}
                >
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 overflow-hidden">
                        <User size={20} />
                    </div>
                    <div className="hidden sm:block text-left mr-1">
                        <p className="text-xs font-bold text-slate-700 leading-tight truncate max-w-[120px]">
                            {user?.name || 'Yükleniyor...'}
                        </p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isProfileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 5, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-full w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                        >
                            {/* Dropdown Header */}
                            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>

                            {/* Dropdown Actions */}
                            <div className="p-2">
                                <Link
                                    href="/hesap-ayarlari"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    <Settings size={18} />
                                    Hesap Ayarları
                                </Link>
                                <Link
                                    href="/restoran-bilgileri"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    <Store size={18} />
                                    Restoran Bilgileri
                                </Link>
                                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                >
                                    <LogOut size={18} />
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
