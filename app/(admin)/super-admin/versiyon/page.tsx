"use client";
import React, { useState, useEffect } from 'react';
import { GitBranch, UploadCloud, CheckCircle, Package, Loader2 } from 'lucide-react';

export default function VersionManagementPage() {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/version');
                if (!res.ok) throw new Error('Versiyon bilgisi yüklenemedi');
                const data = await res.json();
                setConfig(data.value);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVersion();
    }, []);

    return (
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Page Header Area */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#ea580c] shadow-sm">
                            <GitBranch size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            Versiyon & Dağıtım
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm md:text-base font-bold leading-relaxed">Platform güncellemelerini, modül çekirdek versiyonlarını ve roll-out stratejilerini kontrol edin.</p>
                </div>
                <button className="w-full xl:w-auto bg-[#ea580c] text-white px-10 py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all group">
                    <UploadCloud size={22} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
                    YENİ SÜRÜM YAYINLA
                </button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12 items-start">
                <div className="flex flex-col gap-10">
                    {/* Core Version Dashboard */}
                    <div className="bg-slate-900 rounded-[48px] p-12 md:p-16 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden shadow-2xl shadow-slate-900/40 group">
                        <div className="absolute -right-20 -bottom-20 opacity-[0.05] transform -rotate-12 transition-transform duration-1000 group-hover:scale-110">
                            <Package size={400} />
                        </div>

                        {/* Glassmorphism Accents */}
                        <div className="absolute top-[-10%] left-[20%] w-[300px] h-[300px] bg-[#ea580c]/10 blur-[100px] rounded-full"></div>

                        <div className="w-28 h-28 rounded-[36px] bg-white/5 text-[#ea580c] flex items-center justify-center shrink-0 border border-white/10 shadow-2xl shadow-black/50 relative z-10 backdrop-blur-xl">
                            <GitBranch size={56} strokeWidth={2.5} />
                        </div>

                        <div className="flex-1 relative z-10 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                                <span className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black tracking-[0.2em] uppercase shadow-lg shadow-emerald-500/20">PARETO STABLE</span>
                                <span className="text-slate-500 text-[11px] font-black tracking-widest uppercase">Build M-892.42</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-6">
                                {loading ? 'Sistem taranıyor...' : `QRlamenü Core ${config?.version || 'v2.4.1'}`}
                            </h3>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                    Son kararlı sürüm • {loading ? '...' : new Date(config?.lastUpdate || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <button className="px-8 py-4 rounded-2xl bg-white/5 text-white border border-white/10 font-black text-[10px] tracking-widest uppercase hover:bg-white hover:text-slate-900 transition-all z-10 backdrop-blur-md">
                            SÜRÜM DETAYLARI
                        </button>
                    </div>

                    {/* Module Library */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group">
                        <div className="p-10 border-b border-slate-50 bg-white flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                <Package size={24} strokeWidth={2.5} className="text-[#ea580c]" />
                                Modül Kütüphanesi & Bağımlılıklar
                            </h3>
                            <div className="px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{config?.modules?.length || 0} AKTİF MODÜL</span>
                            </div>
                        </div>
                        <div className="p-10 bg-white space-y-2">
                            {loading ? (
                                <div className="flex flex-col items-center gap-8 py-24">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full border-4 border-slate-50 border-t-[#ea580c] animate-spin"></div>
                                        <Package size={32} className="absolute inset-0 m-auto text-slate-200 animate-pulse" />
                                    </div>
                                    <span className="font-black text-slate-400 text-xs tracking-[0.2em] uppercase">MODÜLLER ANALİZ EDİLİYOR...</span>
                                </div>
                            ) : error ? (
                                <div className="text-rose-500 p-10 text-center font-black uppercase text-sm">{error}</div>
                            ) : config?.modules?.map((row: any, i: number) => (
                                <div key={i} className="group/row flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 border-b last:border-0 border-slate-50 hover:bg-slate-50/50 rounded-2xl px-6 transition-all duration-300">
                                    <div className="flex items-center gap-6 mb-4 sm:mb-0">
                                        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl border border-slate-200 flex items-center justify-center transition-all duration-300 group-hover/row:scale-110 group-hover/row:bg-white group-hover/row:text-[#ea580c] group-hover/row:shadow-lg">
                                            <Package size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-lg tracking-tight mb-1">{row.name}</p>
                                            <p className="text-[10px] text-slate-400 font-black tracking-widest">SİSTEM ETİKETİ: <span className="text-slate-600">MOD-CORE-{row.ver.replace(/\./g, '')}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-right">
                                            <p className="font-black text-slate-900 text-lg tracking-tighter mb-1">v{row.ver}</p>
                                            <p className="text-[9px] text-slate-400 font-black tracking-widest uppercase italic">API V2.4 Compatible</p>
                                        </div>
                                        <span className={`
                                            text-[9px] font-black px-5 py-2.5 rounded-xl border tracking-widest uppercase transition-all shadow-sm
                                            ${row.status === 'Stable'
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-500/5'
                                                : 'bg-orange-50 border-orange-100 text-orange-600 shadow-orange-500/5'}
                                        `}>
                                            {row.status === 'Stable' ? 'KARARLI' : 'TEST STAGE'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Patch Tracking */}
                <aside className="flex flex-col gap-10 sticky top-12 h-fit">
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 group">
                        <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-10 border-b border-slate-50 pb-6 flex items-center justify-between">
                            Patch Kayıtları
                            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                        </h3>
                        <div className="space-y-10">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-6 group/patch">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 shadow-lg shadow-emerald-500/5 transition-transform group-hover/patch:scale-110">
                                        <CheckCircle size={20} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-sm mb-2 uppercase tracking-tight italic">Patch 2.4.1-{i * 42}</p>
                                        <p className="text-slate-500 text-xs leading-relaxed font-bold">
                                            Tenant resolution katmanında slug çakışması ve session timeout hataları giderildi.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 mt-12 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all active:scale-95">
                            Tüm Günlükleri İndir (JSON/CSV)
                        </button>
                    </div>

                    {/* Future Version Highlights */}
                    <div className="bg-gradient-to-br from-[#4f46e5] to-[#2e2a8c] rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-3xl rounded-full transition-transform duration-1000 group-hover:scale-150"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <GitBranch size={22} className="text-white" strokeWidth={3} />
                                </div>
                                <h4 className="text-lg font-black tracking-tight leading-none">Gelecek Sürüm: v2.5.0</h4>
                            </div>
                            <p className="text-indigo-100/80 text-sm leading-relaxed font-bold mb-8">
                                Yeni sürüm şu anda <span className="text-white font-black">Beta Stage</span> aşamasında. Çoklu dil desteği ve gelişmiş yetkilendirme modülleri eklendi.
                            </p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(dot => (
                                    <div key={dot} className={`h-2 rounded-full transition-all duration-500 ${dot === 1 ? 'w-10 bg-white' : 'w-2 bg-white/20 group-hover:bg-white/40'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
