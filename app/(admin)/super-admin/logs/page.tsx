"use client";
import React, { useState, useEffect } from 'react';
import { Terminal, Shield, AlertTriangle, CheckCircle, Info, Search, Loader2 } from 'lucide-react';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/logs');
                if (!res.ok) throw new Error('Loglar yüklenemedi');
                const data = await res.json();
                setLogs(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const clearLogs = async () => {
        if (!confirm('Tüm sistem loglarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        try {
            setLoading(true);
            const res = await fetch('/api/admin/logs', { method: 'DELETE' });
            if (res.ok) {
                const refreshed = await fetch('/api/admin/logs').then(r => r.json());
                setLogs(refreshed);
            } else {
                alert('Loglar temizlenemedi.');
            }
        } catch (err) {
            console.error('Clear logs error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLogColor = (level: string) => {
        switch (level) {
            case 'SUCCESS': return '#4caf50';
            case 'ERROR': return '#f44336';
            case 'WARNING': return '#ffc107';
            default: return '#aaa';
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Sistem Logları & Monitor</h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base font-medium">Platform genelinde gerçekleşen kritik olayları, API trafiklerini ve sistem hatalarını gerçek zamanlı izleyin.</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                        <Info size={18} strokeWidth={2.5} /> Rehber
                    </button>
                    <button onClick={clearLogs} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-[#ff7a21] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 border border-orange-400/20 hover:bg-orange-600 transition-all active:scale-95">
                        <Terminal size={18} strokeWidth={2.5} /> Terminali Temizle
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
                <div className="space-y-6">
                    {/* Sophisticated Dark Terminal Viewer */}
                    <div className="bg-slate-900 rounded-[40px] p-6 md:p-10 shadow-2xl shadow-slate-900/40 border border-white/5 relative min-h-[600px] lg:min-h-[700px] max-h-[80vh] overflow-hidden flex flex-col">
                        {/* Terminal Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 mb-8 border-b border-white/5">
                            <div className="flex flex-wrap gap-6 text-[10px] font-black tracking-widest">
                                <div className="flex items-center gap-3 text-emerald-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse"></div>
                                    SUCCESS
                                </div>
                                <div className="flex items-center gap-3 text-rose-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e]"></div>
                                    ERROR
                                </div>
                                <div className="flex items-center gap-3 text-amber-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b]"></div>
                                    WARNING
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                LIVE MONITORING • MESA OS V2.5
                            </div>
                        </div>

                        {/* Log Stream Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-xs md:text-sm leading-relaxed space-y-1.5 pr-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-8 py-20 text-slate-500">
                                    <Loader2 size={56} className="animate-spin text-[#ff7a21]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Sistem Kayıtları Analiz Ediliyor...</span>
                                </div>
                            ) : error ? (
                                <div className="p-8 rounded-3xl bg-rose-500/10 border-2 border-rose-500/20">
                                    <span className="text-rose-500 font-black mr-4">[SYSTEM_CRITICAL_FAILURE]</span>
                                    <span className="text-white font-medium">{error}</span>
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-8 py-20 text-slate-700">
                                    <div className="p-6 rounded-3xl bg-white/5">
                                        <Terminal size={48} strokeWidth={1} />
                                    </div>
                                    <p className="text-sm font-bold italic">Aktif bir sistem kaydı bulunamadı. Platform şu anda stabil.</p>
                                </div>
                            ) : (
                                <>
                                    {logs.map((log) => (
                                        <div key={log.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                            <span className="text-slate-600 font-bold shrink-0">[{new Date(log.createdAt).toLocaleTimeString('tr-TR')}]</span>
                                            <span className="w-24 shrink-0 font-black uppercase tracking-widest text-[10px] pt-0.5" style={{ color: getLogColor(log.level) }}>{log.level}</span>
                                            <span className={`font-medium ${log.level === 'ERROR' ? 'text-rose-200' : 'text-slate-300'}`}>{log.message}</span>
                                            {log.category && <span className="ml-auto text-slate-700 font-black text-[10px] bg-white/5 px-2 py-0.5 rounded-md self-start">#{log.category}</span>}
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-4 p-4 mt-6 animate-pulse">
                                        <div className="w-2 h-5 bg-[#ff7a21]"></div>
                                        <span className="text-[10px] font-black text-[#ff7a21] uppercase tracking-[0.2em]">Gerçek zamanlı veri akışı bekleniyor...</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Health Monitor */}
                <div className="xl:sticky xl:top-8 flex flex-col gap-6">
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Sistem Sağlığı</h3>
                        <div className="space-y-4">
                            <div className="group flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border-2 border-slate-50 hover:bg-white hover:border-[#ff7a21]/20 transition-all duration-500">
                                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100">
                                    <CheckCircle size={22} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Veritabanı</p>
                                    <p className="text-sm font-black text-gray-900 mt-0.5">Bağlı / Stabil</p>
                                </div>
                            </div>

                            <div className="group flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border-2 border-slate-50 hover:bg-white hover:border-rose-200 transition-all duration-500">
                                <div className="p-3 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100">
                                    <AlertTriangle size={22} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Hatalar</p>
                                    <p className="text-sm font-black text-gray-900 mt-0.5">{logs.filter(l => l.level === 'ERROR').length} Bekleyen</p>
                                </div>
                            </div>

                            <div className="group flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border-2 border-slate-50 hover:bg-white hover:border-sky-200 transition-all duration-500">
                                <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200">
                                    <Terminal size={22} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Gecikme (Latency)</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-sm font-black text-gray-900">42ms</p>
                                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">MÜKEMMEL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#ff7a21]/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/10">
                                    <Shield size={24} className="text-[#ff7a21]" strokeWidth={3} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-black">Güvenlik Durumu</h3>
                            </div>

                            <p className="text-sm font-medium text-slate-400 leading-relaxed italic mb-8">
                                Son 24 saat içinde <span className="text-white font-black">0</span> yetkisiz erişim girişimi tespit edildi. Sistem koruması aktif.
                            </p>

                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                Denetim Geçmişini Görüntüle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
