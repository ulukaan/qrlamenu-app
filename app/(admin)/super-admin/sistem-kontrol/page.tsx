"use client";
import React, { useState, useEffect } from 'react';
import {
    Activity,
    Database,
    Server,
    Cpu,
    Clock,
    ExternalLink,
    Github,
    Globe,
    AlertCircle,
    RefreshCw,
    Store,
    Users,
    Utensils,
    ShoppingBag,
    Bell,
    FileText,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: { [key: string]: any } = {
    Store,
    Users,
    Utensils,
    ShoppingBag,
    Bell,
    FileText,
    CreditCard
};

export default function SystemControlPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/system');
            if (!res.ok) throw new Error('Veriler alınamadı');
            const jsonData = await res.json();
            setData(jsonData);
        } catch (err) {
            setError('Sistem verileri alınırken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatUptime = (seconds: number) => {
        if (!seconds) return '0d 0s 0d';
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${d}g ${h}s ${m}d`;
    };

    const formatBytes = (bytes: number) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="animate-spin text-orange-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Hata Oluştu</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={fetchData} className="px-6 py-2 bg-orange-600 text-white rounded-xl font-bold">Tekrar Dene</button>
            </div>
        );
    }

    return (
        <div className="px-6 py-8 w-full max-w-full">
            <header className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-[6px] bg-slate-100 flex items-center justify-center text-slate-700 shadow-sm border border-slate-200">
                            <Server size={18} />
                        </div>
                        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">
                            Sistem Kontrol Merkezi
                        </h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">Platform altyapı sağlığı ve sunucu performansı analitiği.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                    <div className="h-9 px-3 bg-white border border-slate-200 rounded-[6px] flex items-center gap-2 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Otomatik Tarama</span>
                    </div>
                    <button
                        onClick={fetchData}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-9 px-4 bg-slate-900 border border-slate-800 rounded-[6px] text-[13px] font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''}`} />
                        SENKRONİZE ET
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. SUNUCU SAĞLIĞI (CPU, RAM, UPTIME) */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-slate-900 rounded-[6px] p-6 md:p-8 text-white shadow-sm border border-slate-800 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 opacity-5">
                            <Cpu size={250} strokeWidth={1} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-5">
                                <h2 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    SUNUCU ÇEKİRDEK DURUMU
                                </h2>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-[4px] border border-slate-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">UPTIME %99.98</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-3 bg-indigo-500 rounded-[2px]"></div> Node.js Runtıme
                                    </p>
                                    <div>
                                        <p className="text-2xl font-bold tracking-tight mb-2">{data?.system?.nodeVersion}</p>
                                        <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold tracking-widest bg-emerald-400/10 w-fit px-2 py-0.5 rounded-[4px] border border-emerald-400/20">
                                            LTS STABLE
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 md:border-l md:border-slate-800 md:pl-8">
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-3 bg-amber-500 rounded-[2px]"></div> Aktıf Çalışma Süresı
                                    </p>
                                    <div>
                                        <p className="text-2xl font-bold tracking-tight mb-2">{formatUptime(data?.system?.uptime)}</p>
                                        <div className="text-slate-300 text-[10px] font-bold tracking-widest flex items-center gap-1.5 bg-slate-800 w-fit px-2 py-0.5 rounded-[4px] border border-slate-700 uppercase">
                                            <Clock size={12} /> Kesintisiz Erişim
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 md:border-l md:border-slate-800 md:pl-8">
                                    <div className="flex justify-between items-end mb-1">
                                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1 h-3 bg-rose-500 rounded-[2px]"></div> Bellek Optımırasyonu
                                        </p>
                                        <span className="text-rose-400 text-[16px] font-bold tracking-tight">%{data?.system?.memoryUsage?.percent}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data?.system?.memoryUsage?.percent}%` }}
                                            className="h-full bg-rose-500"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                                        {formatBytes(data?.system?.memoryUsage?.total - data?.system?.memoryUsage?.free)} <span className="text-slate-600">USED</span> / {formatBytes(data?.system?.memoryUsage?.total)} <span className="text-slate-600">TOTAL</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. VERİTABANI İSTATİSTİKLERİ */}
                    <section className="bg-white rounded-[6px] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
                            <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-2">
                                <Database size={14} className="text-slate-400" />
                                VERİTABANI VARLIK DAĞILIMI
                            </h2>
                            <div className="px-3 py-1 bg-slate-50 rounded-[4px] border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">PostgreSQL Cloud</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data?.db?.map((item: any, idx: number) => {
                                const Icon = iconMap[item.icon] || Database;
                                return (
                                    <div
                                        key={idx}
                                        className="p-5 rounded-[6px] border border-slate-200 bg-slate-50 flex flex-col items-center text-center hover:bg-white hover:border-slate-300 transition-colors"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-[6px] flex items-center justify-center mb-3 bg-white border border-slate-200 shadow-sm"
                                        >
                                            <Icon size={20} className="text-slate-600" />
                                        </div>
                                        <p className="text-[20px] font-bold text-slate-900 tracking-tight leading-none mb-1.5">{item.count}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* 3. YAN PANEL (HIZLI LİNKLER & ARAÇLAR) */}
                <aside className="space-y-6">
                    <section className="bg-white rounded-[6px] border border-slate-200 p-5 shadow-sm">
                        <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-100 pb-3 mb-4">Hızlı Erişim Araçları</h2>

                        <div className="space-y-2">
                            <a
                                href="https://hpanel.hostinger.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 text-slate-700 rounded-[6px] hover:bg-slate-50 transition-colors text-[12px] font-semibold no-underline"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Globe size={14} className="text-indigo-600" /> Hostinger Panel
                                </span>
                                <ExternalLink size={14} className="text-slate-400" />
                            </a>
                            <a
                                href="https://github.com/ulukaan/qrlamenu.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 text-white rounded-[6px] hover:bg-slate-800 transition-colors text-[12px] font-semibold no-underline"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Github size={14} /> GitHub Repository
                                </span>
                                <ExternalLink size={14} className="text-slate-400" />
                            </a>
                            <div className="p-4 bg-slate-50 rounded-[6px] border border-slate-200 mt-4 space-y-3">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12} /> SİSTEM BİLGİSİ</p>
                                <div className="flex items-center justify-between bg-white px-3 h-8 rounded-[4px] border border-slate-200 shadow-sm">
                                    <span className="text-[12px] font-semibold text-slate-700">Production Mode</span>
                                    <span className="text-emerald-600 text-[10px] font-bold tracking-wider">AKTİF</span>
                                </div>
                                <div className="flex items-center justify-between bg-white px-3 h-8 rounded-[4px] border border-slate-200 shadow-sm">
                                    <span className="text-[12px] font-semibold text-slate-700">WAF Güvenlik</span>
                                    <span className="text-indigo-600 text-[10px] font-bold tracking-wider">KORUMADA</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-indigo-50 border border-indigo-100 rounded-[6px] p-5 flex gap-4 items-start shadow-sm">
                        <div className="bg-indigo-100 p-2 rounded-[4px] text-indigo-600 mt-0.5 shrink-0">
                            <AlertCircle size={18} />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-bold text-indigo-900 mb-1">Teknik Destek</h3>
                            <p className="text-indigo-700 text-[12px] font-medium leading-relaxed mb-3">Sistemle ilgili altyapısal olağandışı bir durum tespit ederseniz, kayıt açabilirsiniz.</p>
                            <button className="h-8 px-3 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-[4px] font-bold text-[11px] uppercase tracking-wider transition-colors shadow-sm">
                                Destek Talebi Aç
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
