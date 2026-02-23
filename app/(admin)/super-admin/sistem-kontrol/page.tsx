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
                <RefreshCw className="animate-spin text-orange-500" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Hata Oluştu</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={fetchData} className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold">Tekrar Dene</button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Server className="text-orange-500" /> QRlamenü Sistem Kontrol Merkezi
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Altyapı sağlığı, veritabanı istatistikleri ve sunucu performansı.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Verileri Yenile
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. SUNUCU SAĞLIĞI (CPU, RAM, UPTIME) */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Cpu size={96} />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-[11px] font-black tracking-widest text-slate-400 border-b border-white/10 pb-3 mb-5 flex items-center gap-2">
                                <Activity size={12} className="text-orange-500" /> SUNUCU DURUMU (HOSTINGER)
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Node.js Versiyon</p>
                                    <p className="text-xl font-black tracking-tight">{data?.system?.nodeVersion}</p>
                                    <div className="flex items-center gap-1.5 text-green-400 text-[11px] font-bold bg-green-400/10 w-fit px-2 py-0.5 rounded-full mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                        AKTİF & ÇALIŞIYOR
                                    </div>
                                </div>
                                <div className="space-y-1.5 border-l border-white/5 pl-6">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Çalışma Süresi (Uptime)</p>
                                    <p className="text-xl font-black tracking-tight">{formatUptime(data?.system?.uptime)}</p>
                                    <div className="text-slate-500 text-[11px] font-bold flex items-center gap-1.5 mt-2 bg-slate-800/50 w-fit px-2 py-0.5 rounded-full">
                                        <Clock size={10} /> Son Reset'ten Beri
                                    </div>
                                </div>
                                <div className="space-y-1.5 border-l border-white/5 pl-6">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider flex justify-between">
                                        <span>Bellek Kullanımı</span>
                                        <span className="text-orange-500 font-black">%{data?.system?.memoryUsage?.percent}</span>
                                    </p>
                                    <div className="h-2 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data?.system?.memoryUsage?.percent}%` }}
                                            className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2 font-bold tracking-wide">
                                        {formatBytes(data?.system?.memoryUsage?.total - data?.system?.memoryUsage?.free)} / {formatBytes(data?.system?.memoryUsage?.total)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. VERİTABANI İSTATİSTİKLERİ */}
                    <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                        <h2 className="text-[11px] font-black tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                            <Database size={12} className="text-slate-400" /> VERİTABANI KAYIT DAĞILIMI
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data?.db?.map((item: any, idx: number) => {
                                const Icon = iconMap[item.icon] || Database;
                                return (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -3 }}
                                        className="p-4 rounded-xl border border-slate-50 hover:border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col items-center text-center transition-all cursor-default"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm"
                                            style={{ backgroundColor: `${item.color}15`, color: item.color }}
                                        >
                                            <Icon size={20} />
                                        </div>
                                        <p className="text-lg font-black text-slate-900 tracking-tight">{item.count}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.name}</p>
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

                    <section className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
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
