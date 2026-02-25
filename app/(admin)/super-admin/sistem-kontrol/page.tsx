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
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#ea580c] shadow-sm">
                            <Server size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            Sistem Kontrol Merkezi
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm md:text-base font-bold leading-relaxed">Platform altyapı sağlığı, dağıtık veritabanı istatistikleri ve gerçek zamanlı sunucu performansı analitiği.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm group">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Otomatik Tarama Aktif</span>
                    </div>
                    <button
                        onClick={fetchData}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black text-white hover:bg-[#ea580c] hover:border-transparent transition-all shadow-xl shadow-slate-900/10 active:scale-95 group"
                    >
                        <RefreshCw size={18} strokeWidth={3} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                        VERİLERİ SENKRONİZE ET
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. SUNUCU SAĞLIĞI (CPU, RAM, UPTIME) */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-slate-900 rounded-[40px] p-10 md:p-12 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110 group-hover:-rotate-12">
                            <Cpu size={400} strokeWidth={1} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                                <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                                    SUNUCU ÇEKİRDEK DURUMU (HOSTINGER VPS)
                                </h2>
                                <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-xl border border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">UPTIME %99.98</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="space-y-4">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-3 bg-orange-600 rounded-full"></div> Node.js Runtıme
                                    </p>
                                    <div>
                                        <p className="text-3xl font-black tracking-tighter leading-none mb-2">{data?.system?.nodeVersion}</p>
                                        <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black tracking-[0.15em] bg-emerald-400/10 w-fit px-3 py-1 rounded-lg border border-emerald-400/20">
                                            LTS STABLE
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 md:border-l md:border-white/5 md:pl-12">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-3 bg-blue-500 rounded-full"></div> Aktıf Çalışma Süresı
                                    </p>
                                    <div>
                                        <p className="text-3xl font-black tracking-tighter leading-none mb-2">{formatUptime(data?.system?.uptime)}</p>
                                        <div className="text-slate-400 text-[9px] font-black tracking-[0.15em] flex items-center gap-1.5 bg-white/5 w-fit px-3 py-1 rounded-lg border border-white/10 uppercase">
                                            <Clock size={10} /> Kesintisiz Erişim
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 md:border-l md:border-white/5 md:pl-12">
                                    <div className="flex justify-between items-end mb-1">
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1 h-3 bg-violet-500 rounded-full"></div> Bellek Optımırasyonu
                                        </p>
                                        <span className="text-[#ea580c] text-xl font-black leading-none tracking-tighter">%{data?.system?.memoryUsage?.percent}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data?.system?.memoryUsage?.percent}%` }}
                                            className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-amber-300 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-black tracking-[0.1em] uppercase">
                                        {formatBytes(data?.system?.memoryUsage?.total - data?.system?.memoryUsage?.free)} <span className="text-slate-700 italic">USED</span> / {formatBytes(data?.system?.memoryUsage?.total)} <span className="text-slate-700 italic">TOTAL</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. VERİTABANI İSTATİSTİKLERİ */}
                    <section className="bg-white rounded-[40px] border border-slate-100 p-10 md:p-12 shadow-sm flex flex-col group">
                        <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
                            <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase flex items-center gap-3">
                                <Database size={16} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-500" />
                                VERİTABANI VARLIK DAĞILIMI (ENTITY ANALYTICS)
                            </h2>
                            <div className="px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">PostgreSQL Cloud</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {data?.db?.map((item: any, idx: number) => {
                                const Icon = iconMap[item.icon] || Database;
                                return (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="p-8 rounded-3xl border border-slate-50 hover:border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col items-center text-center transition-all duration-300 cursor-default group/card hover:shadow-xl hover:shadow-slate-200/40"
                                    >
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-white relative overflow-hidden transition-all duration-300 group-hover/card:scale-110"
                                            style={{ backgroundColor: `${item.color}08`, color: item.color }}
                                        >
                                            <div className="absolute inset-0 opacity-20" style={{ backgroundColor: item.color }}></div>
                                            <Icon size={28} strokeWidth={2.5} className="relative z-10" />
                                        </div>
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">{item.count}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{item.name}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* 3. YAN PANEL (HIZLI LİNKLER & ARAÇLAR) */}
                <aside className="space-y-6">
                    <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                        <h2 className="text-[11px] font-black tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-3 mb-5">HIZLI ERİŞİM ARAÇLARI</h2>

                        <div className="space-y-3">
                            <a
                                href="https://hpanel.hostinger.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-xl group transition-all hover:bg-orange-100 hover:shadow-sm text-xs font-bold no-underline border border-orange-100/50"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Globe size={16} /> Hostinger Panel
                                </span>
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all text-orange-400" />
                            </a>
                            <a
                                href="https://github.com/ulukaan/qrlamenu.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 text-white rounded-xl group transition-all hover:bg-black hover:shadow-md text-xs font-bold no-underline"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Github size={16} /> GitHub Repository
                                </span>
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all text-slate-400" />
                            </a>
                            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 mt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Activity size={10} /> SİSTEM DURUMU</p>
                                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 mb-2 shadow-sm">
                                    <span className="text-xs font-bold text-slate-700">Production Mode</span>
                                    <span className="px-2 py-0.5 bg-green-100/80 border border-green-200 text-green-700 text-[9px] font-black rounded-md tracking-wider">AKTİF</span>
                                </div>
                                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm">
                                    <span className="text-xs font-bold text-slate-700">WAF Güvenlik</span>
                                    <span className="px-2 py-0.5 bg-blue-100/80 border border-blue-200 text-blue-700 text-[9px] font-black rounded-md tracking-wider">KORUMADA</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gradient-to-br from-orange-600 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                            <AlertCircle size={80} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-base font-black mb-1.5 tracking-tight">Yardıma mı ihtiyacınız var?</h3>
                            <p className="text-orange-100/90 text-[11px] font-semibold mb-5 leading-relaxed tracking-wide">Sistemle ilgili teknik veya altyapısal olağandışı bir sorun mu yaşıyorsunuz?</p>
                            <button className="w-full py-3 bg-white hover:bg-slate-50 text-orange-600 rounded-xl font-black text-xs shadow-xl shadow-orange-900/20 active:scale-95 transition-all uppercase tracking-widest hover:-translate-y-0.5 border border-white">
                                DESTEK TALEBİ AÇ
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
