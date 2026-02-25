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
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Versiyon & Dağıtım</h1>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Platform güncellemelerini, modül çekirdek versiyonlarını ve roll-out stratejilerini kontrol edin.</p>
                </div>
                <button className="h-9 px-4 rounded-[6px] bg-slate-900 text-white font-semibold text-[13px] hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm w-full lg:w-auto justify-center">
                    <UploadCloud size={14} /> <span>Yeni Sürüm Yayınla</span>
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="flex flex-col gap-6">
                    {/* Core Version Dashboard */}
                    <div className="bg-slate-900 rounded-[6px] p-6 flex flex-col sm:flex-row gap-6 items-center shadow-sm border border-slate-800 text-white">
                        <div className="w-16 h-16 rounded-[6px] bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0 border border-slate-700">
                            <GitBranch size={28} />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-[4px] text-[10px] font-bold tracking-widest uppercase">Stable Build</span>
                                <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">M-892.42</span>
                            </div>
                            <h3 className="text-[24px] font-bold text-white tracking-tight leading-none mb-2">
                                {loading ? 'Sistem taranıyor...' : `QRlamenü Core ${config?.version || 'v2.4.1'}`}
                            </h3>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-slate-400 text-[12px] font-medium">
                                    Son kararlı sürüm • {loading ? '...' : new Date(config?.lastUpdate || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <button className="h-9 px-4 rounded-[6px] bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-[13px] transition-colors w-full sm:w-auto">
                            Detaylar
                        </button>
                    </div>

                    {/* Module Library */}
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                                <Package size={16} className="text-slate-500" />
                                Modül Kütüphanesi
                            </h3>
                            <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-[4px] uppercase tracking-widest">
                                {config?.modules?.length || 0} Aktif
                            </span>
                        </div>
                        <div className="bg-white">
                            {loading ? (
                                <div className="flex flex-col items-center gap-3 py-16">
                                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                                    <span className="font-medium text-slate-500 text-[13px]">Modüller yükleniyor...</span>
                                </div>
                            ) : error ? (
                                <div className="text-rose-500 py-10 text-center font-medium text-[13px]">{error}</div>
                            ) : config?.modules?.map((row: any, i: number) => (
                                <div key={i} className="flex justify-between items-center py-4 px-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white text-slate-400 rounded-[4px] border border-slate-200 flex items-center justify-center transition-colors group-hover:text-indigo-600 group-hover:border-indigo-100">
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-[14px] leading-tight group-hover:text-indigo-600 transition-colors">{row.name}</p>
                                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">MOD-CORE-{row.ver.replace(/\./g, '')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-bold text-slate-700 text-[13px] leading-tight">v{row.ver}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">v2.4 ONAYLI</p>
                                        </div>
                                        <span className={`
                                            text-[10px] font-bold px-2 py-0.5 rounded-[4px] tracking-widest uppercase border 
                                            ${row.status === 'Stable'
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                : 'bg-amber-50 border-amber-100 text-amber-600'}
                                        `}>
                                            {row.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Patch Tracking */}
                <aside className="flex flex-col gap-6 xl:sticky xl:top-8 h-fit">
                    <div className="bg-white rounded-[6px] p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h3 className="text-[12px] font-bold text-slate-500 tracking-wider uppercase">Patch Kayıtları</h3>
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 items-start group">
                                    <div className="w-6 h-6 rounded-[4px] bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                                        <CheckCircle size={12} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-[13px] mb-0.5 leading-tight">Patch 2.4.1-{i * 42}</p>
                                        <p className="text-slate-500 text-[11px] leading-relaxed">
                                            Tenant resolution katmanında slug çakışması ve session timeout hataları giderildi.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-5 h-8 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-[4px] text-[11px] font-bold tracking-widest uppercase transition-colors">
                            Kayıtları İndir
                        </button>
                    </div>

                    {/* Future Version Highlights */}
                    <div className="bg-indigo-600 rounded-[6px] p-5 text-white shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 bg-white/10 rounded-[4px] border border-indigo-400">
                                    <GitBranch size={16} className="text-indigo-100" />
                                </div>
                                <h4 className="text-[14px] font-bold tracking-tight">Gelecek Sürüm: v2.5.0</h4>
                            </div>
                            <p className="text-indigo-100 text-[12px] leading-relaxed mb-4">
                                Yeni sürüm şu anda <span className="text-white font-semibold">Beta</span> aşamasında. Çoklu dil desteği ve gelişmiş yetki modülleri içerir.
                            </p>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4].map(dot => (
                                    <div key={dot} className={`h-1.5 rounded-full ${dot === 1 ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
