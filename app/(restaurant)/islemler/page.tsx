"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, DollarSign, Activity, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';

interface Transaction {
    id: string;
    title: string;
    amount: number;
    reward: string | null;
    paymentMethod: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
    createdAt: string;
}

export default function Islemler() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch('/api/transactions');
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data || []);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, { bg: string, color: string, label: string, border: string }> = {
            PENDING: { bg: 'bg-amber-50', color: 'text-amber-600', border: 'border-amber-100', label: 'Bekliyor' },
            COMPLETED: { bg: 'bg-emerald-50', color: 'text-emerald-600', border: 'border-emerald-100', label: 'Tamamlandı' },
            FAILED: { bg: 'bg-rose-50', color: 'text-rose-600', border: 'border-rose-100', label: 'Başarısız' },
            CANCELLED: { bg: 'bg-slate-50', color: 'text-slate-500', border: 'border-slate-100', label: 'İptal Edildi' }
        };

        const style = styles[status] || styles.COMPLETED;

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-[4px] border ${style.bg} ${style.color} ${style.border} text-[10px] font-bold uppercase tracking-tight shadow-sm`}>
                {style.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 py-6 px-6 relative z-30 shadow-sm">
                <div className="w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start md:items-center gap-4 md:gap-6">
                            <MobileMenuToggle />
                            <div className="space-y-4">
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">YÖNETİM</Link>
                                    <ChevronRight size={10} className="text-slate-300" />
                                    <span className="text-slate-900">İŞLEMLER</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-900 rounded-[6px] flex items-center justify-center shadow-md">
                                        <DollarSign size={24} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">PARA HAREKETLERİ</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">İŞLEM KAYITLARI</span>
                                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                            <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-[4px]">{transactions.length} Kayıt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 lg:p-10">
                <div className="w-full mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <div className="relative w-16 h-16">
                                <Activity className="w-16 h-16 text-slate-900 animate-pulse opacity-20" strokeWidth={1} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-slate-900 animate-spin" strokeWidth={2.5} />
                                </div>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">VERİLER YÜKLENİYOR...</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[6px] border border-slate-200 overflow-hidden shadow-sm"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">TARİH</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">İŞLEM DETAYI</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">TUTAR</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">DURUM</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5 text-[11px] font-bold text-slate-400 tracking-tight">
                                                    {new Date(tx.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[12px] font-bold text-slate-900 tracking-tight uppercase mb-0.5">{tx.title}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{tx.paymentMethod}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <span className="text-[13px] font-bold text-slate-900 tracking-tight">
                                                        {tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}₺
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <StatusBadge status={tx.status} />
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-24 text-center">
                                                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                                                        <Search size={32} className="text-slate-400" />
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">HENÜZ İŞLEM KAYDI BULUNMUYOR.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                ::-webkit-scrollbar {
                    height: 5px;
                    width: 5px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
            `}</style>
        </div>
    );
}
