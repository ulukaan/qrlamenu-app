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
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Sistem Logları & Monitor</h1>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Platform genelinde gerçekleşen kritik olayları, API trafiklerini ve sistem hatalarını gerçek zamanlı izleyin.</p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none h-9 px-4 rounded-[6px] border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                        <Info size={16} /> Rehber
                    </button>
                    <button onClick={clearLogs} className="flex-1 lg:flex-none h-9 px-4 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors shadow-sm">
                        <Terminal size={16} /> Terminali Temizle
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="space-y-6">
                    {/* Sophisticated Dark Terminal Viewer */}
                    <div className="bg-slate-900 rounded-[6px] p-6 shadow-sm border border-slate-800 relative min-h-[500px] lg:min-h-[600px] max-h-[75vh] overflow-hidden flex flex-col">
                        {/* Terminal Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-4 border-b border-slate-800">
                            <div className="flex items-center gap-4 text-[11px] font-bold tracking-widest">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    SUCCESS
                                </div>
                                <div className="flex items-center gap-2 text-rose-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                                    ERROR
                                </div>
                                <div className="flex items-center gap-2 text-amber-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                    WARNING
                                </div>
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                LIVE MONITORING • OS V2.5
                            </div>
                        </div>

                        {/* Log Stream Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[12px] leading-relaxed space-y-1 pr-2">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-slate-500">
                                    <Loader2 size={32} className="animate-spin text-slate-400" />
                                    <span className="text-[11px] font-semibold uppercase tracking-widest">Sistem Kayıtları Bekleniyor...</span>
                                </div>
                            ) : error ? (
                                <div className="p-4 rounded-[4px] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] flex flex-col gap-1">
                                    <span className="font-bold">[SYSTEM_CRITICAL_FAILURE]</span>
                                    <span>{error}</span>
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-slate-500">
                                    <div className="p-4 rounded-[6px] bg-slate-800/50 border border-slate-700/50">
                                        <Terminal size={32} />
                                    </div>
                                    <p className="text-[12px] font-semibold">Aktif sistem kaydı bulunamadı. Platform stabil.</p>
                                </div>
                            ) : (
                                <>
                                    {logs.map((log) => (
                                        <div key={log.id} className="flex gap-3 px-2 py-1.5 rounded-[4px] hover:bg-slate-800 transition-colors group">
                                            <span className="text-slate-500 font-semibold shrink-0">[{new Date(log.createdAt).toLocaleTimeString('tr-TR')}]</span>
                                            <span className="w-20 shrink-0 font-bold uppercase tracking-wider text-[10px] pt-[2px]" style={{ color: getLogColor(log.level) }}>{log.level}</span>
                                            <span className={`font-medium ${log.level === 'ERROR' ? 'text-rose-300' : 'text-slate-300'}`}>{log.message}</span>
                                            {log.category && <span className="ml-auto text-slate-400 font-semibold text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-[4px] self-start border border-slate-700">#{log.category}</span>}
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2 p-2 mt-4 animate-pulse opacity-50">
                                        <div className="w-1.5 h-3 bg-slate-500"></div>
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Bağlandı, kayıtlar bekleniyor...</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Health Monitor */}
                <div className="xl:sticky xl:top-8 flex flex-col gap-6">
                    <div className="bg-white rounded-[6px] p-6 shadow-sm border border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5 border-b border-slate-100 pb-3">Sistem Sağlığı</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-[6px] bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                                <div className="p-2 rounded-[4px] bg-emerald-100 text-emerald-600 shrink-0">
                                    <CheckCircle size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Veritabanı</p>
                                    <p className="text-[13px] font-semibold text-slate-900 leading-none mt-1">Bağlı / Stabil</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-[6px] bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                                <div className="p-2 rounded-[4px] bg-rose-100 text-rose-600 shrink-0">
                                    <AlertTriangle size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hatalar</p>
                                    <p className="text-[13px] font-semibold text-slate-900 leading-none mt-1">{logs.filter(l => l.level === 'ERROR').length} Bekleyen</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-[6px] bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                                <div className="p-2 rounded-[4px] bg-indigo-100 text-indigo-600 shrink-0">
                                    <Terminal size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gecikme (Latency)</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[13px] font-semibold text-slate-900 leading-none">42ms</p>
                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-[3px]">MÜKEMMEL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[6px] p-6 text-white shadow-sm border border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-slate-800 p-2 rounded-[4px] text-slate-400">
                                <Shield size={16} />
                            </div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Güvenlik Durumu</h3>
                        </div>

                        <p className="text-[12px] font-medium text-slate-400 leading-relaxed mb-5">
                            Son 24 saat içinde <span className="text-white font-bold">0</span> yetkisiz erişim girişimi tespit edildi. Sistem koruması aktif.
                        </p>

                        <button className="w-full h-9 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-[6px] text-[11px] font-semibold uppercase tracking-widest transition-colors flex items-center justify-center">
                            Denetim Geçmişine Bak
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
