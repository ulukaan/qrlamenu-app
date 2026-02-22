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
        <div className="p-8 max-w-[1600px] mx-auto">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Server className="text-orange-500" /> QRlamenü Sistem Kontrol Merkezi
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Altyapı sağlığı, veritabanı istatistikleri ve sunucu performansı.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Verileri Yenile
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. SUNUCU SAĞLIĞI (CPU, RAM, UPTIME) */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Cpu size={120} />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-8">SUNUCU DURUMU (HOSTINGER)</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <p className="text-slate-400 text-sm font-bold">Node.js Versiyon</p>
                                    <p className="text-2xl font-black">{data?.system?.nodeVersion}</p>
                                    <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                        AKTİF & ÇALIŞIYOR
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-slate-400 text-sm font-bold">Çalışma Süresi (Uptime)</p>
                                    <p className="text-2xl font-black">{formatUptime(data?.system?.uptime)}</p>
                                    <div className="text-slate-500 text-xs font-bold flex items-center gap-1">
                                        <Clock size={12} /> Son Resetti'ten Beri
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-slate-400 text-sm font-bold">Bellek Kullanımı</p>
                                    <p className="text-2xl font-black">%{data?.system?.memoryUsage?.percent}</p>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data?.system?.memoryUsage?.percent}%` }}
                                            className="h-full bg-orange-500"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 font-bold">
                                        {formatBytes(data?.system?.memoryUsage?.total - data?.system?.memoryUsage?.free)} / {formatBytes(data?.system?.memoryUsage?.total)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. VERİTABANI İSTATİSTİKLERİ */}
                    <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                        <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-8 flex items-center gap-2">
                            <Database size={14} /> VERİTABANI KAYIT DAĞILIMI
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {data?.db?.map((item: any, idx: number) => {
                                const Icon = iconMap[item.icon] || Database;
                                return (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5 }}
                                        className="p-6 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col items-center text-center"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${item.color}15`, color: item.color }}
                                        >
                                            <Icon size={24} />
                                        </div>
                                        <p className="text-xl font-black text-slate-900">{item.count}</p>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-1">{item.name}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* 3. YAN PANEL (HIZLI LİNKLER & ARAÇLAR) */}
                <aside className="space-y-8">
                    <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                        <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-6">HIZLI ERİŞİM ARAÇLARI</h2>

                        <div className="space-y-4">
                            <a
                                href="https://hpanel.hostinger.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-orange-50 text-orange-700 rounded-2xl group transition-all hover:bg-orange-100 text-sm font-bold no-underline"
                            >
                                <span className="flex items-center gap-3">
                                    <Globe size={18} /> Hostinger Panel
                                </span>
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                            </a>
                            <a
                                href="https://github.com/ulukaan/qrlamenu.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl group transition-all hover:bg-black text-sm font-bold no-underline"
                            >
                                <span className="flex items-center gap-3">
                                    <Github size={18} /> GitHub Repository
                                </span>
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                            </a>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">SİSTEM DURUMU</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-700">Production Mode</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg">AKTİF</span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-sm font-bold text-slate-700">WAF Güvenlik</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg">KORUMADA</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] p-8 text-white shadow-lg">
                        <h3 className="text-lg font-black mb-2">Yardıma mı ihtiyacınız var?</h3>
                        <p className="text-orange-100 text-sm font-medium mb-6">Sistemle ilgili teknik bir sorun mu yaşıyorsunuz?</p>
                        <button className="w-full py-4 bg-white text-orange-600 rounded-2xl font-black text-sm shadow-xl shadow-orange-900/20 active:scale-95 transition-all">
                            DESTEK TALEBİ AÇ
                        </button>
                    </section>
                </aside>
            </div>
        </div>
    );
}
