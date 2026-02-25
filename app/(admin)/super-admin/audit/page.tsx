"use client";
import React, { useState, useEffect } from 'react';
import { Database, Search, Shield, Clock, User, Info, Loader2 } from 'lucide-react';

export default function AuditLogPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/audit');
                if (!res.ok) throw new Error('Denetim kayıtları yüklenemedi');
                const data = await res.json();
                setLogs(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAuditLogs();
    }, []);

    return (
        <div className="px-6 py-8 w-full max-w-full">
            {/* Sayfa Üst Bilgisi */}
            <header className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Sistem Denetim İzleri</h1>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Platform üzerindeki kritik yönetimsel işlemlerin güvenlik kayıtları ve işlem geçmişi.</p>
                </div>
                <div className="w-full xl:w-auto">
                    <div className="relative group w-full xl:w-[400px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Eylem, admin veya IP..."
                            className="w-full pl-9 pr-4 py-2 rounded-[6px] border border-slate-200 bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all text-[13px] text-slate-700 shadow-sm"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="space-y-6 min-w-0">
                    {/* Denetim Kayıtları */}
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-1.5 rounded-[4px] border border-slate-200 text-slate-600 shadow-sm">
                                    <Database size={16} />
                                </div>
                                <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Olay Akışı</h3>
                            </div>
                            <button className="w-full sm:w-auto h-8 px-3 rounded-[4px] bg-white text-slate-600 text-[11px] font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none">
                                Dışa Aktar (.CSV)
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-200">Zaman Damgası</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-200">Aktör</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-200">Eylem</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-200">Detay</th>
                                        <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-200">Kaynak IP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 size={24} className="animate-spin text-slate-400" />
                                                    <span className="text-slate-500 font-medium text-[12px]">Denetim verileri yükleniyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="w-12 h-12 bg-slate-50 rounded-[6px] flex items-center justify-center mx-auto mb-4 text-slate-300 border border-slate-200">
                                                    <Database size={24} />
                                                </div>
                                                <p className="text-slate-500 font-medium text-[13px]">Henüz bir denetim kaydı bulunmuyor.</p>
                                            </td>
                                        </tr>
                                    ) : logs.map((log) => (
                                        <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-700 tabular-nums">
                                                    <Clock size={14} className="text-slate-400" />
                                                    {new Date(log.createdAt).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 truncate">
                                                        <User size={12} />
                                                    </div>
                                                    <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[140px] leading-tight">{log.adminEmail || 'Sistem'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] border uppercase tracking-widest ${log.action.includes('CREATE') ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                    log.action.includes('UPDATE') ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                        log.action.includes('DELETE') ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                            'bg-slate-50 text-slate-500 border-slate-200'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 max-w-xs xl:max-w-md">
                                                <div className="flex items-center gap-2">
                                                    <Info size={14} className="text-slate-400 shrink-0" />
                                                    <span className="text-[12px] text-slate-600 leading-relaxed truncate">{log.details}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="font-mono text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-[4px] border border-slate-200 shrink-0">{log.ipAddress || '127.0.0.1'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="space-y-6 xl:sticky xl:top-8 xl:h-fit">
                    <div className="bg-slate-900 rounded-[6px] p-5 text-white shadow-sm border border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-slate-800 p-2 rounded-[4px] border border-slate-700">
                                <Shield size={18} className="text-slate-300" />
                            </div>
                            <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-300">Bütünlük Koruması</h3>
                        </div>

                        <p className="text-[12px] font-medium text-slate-400 leading-relaxed mb-5">
                            Audit logları salt-okunur olarak tutulur ve geriye dönük silinemez. Tüm kayıtlar <span className="text-white underline decoration-slate-600 underline-offset-2">SHA-256</span> hash zinciri ile korunur.
                        </p>

                        <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-[4px] border border-emerald-400/20 w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                            Koruma Aktif
                        </div>
                    </div>

                    <div className="bg-white rounded-[6px] p-5 shadow-sm border border-slate-200">
                        <h4 className="text-[12px] font-semibold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Search size={14} className="text-slate-400" /> Hızlı Filtrele
                        </h4>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Zaman Aralığı</label>
                                <div className="relative">
                                    <select className="w-full h-9 px-3 rounded-[4px] border border-slate-200 bg-white text-[13px] font-medium text-slate-800 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none appearance-none cursor-pointer pr-8 shadow-sm">
                                        <option>Son 24 Saat</option>
                                        <option>Son 7 Gün</option>
                                        <option>Son 30 Gün</option>
                                        <option>Tüm Zamanlar</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <Clock size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-5 border-t border-slate-100">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-[4px] border border-slate-200">
                                    <span className="text-[12px] font-bold text-slate-600 uppercase tracking-widest">Bugün</span>
                                    <span className="text-[15px] font-semibold text-slate-800 tabular-nums">{logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-[4px] border border-slate-200">
                                    <span className="text-[12px] font-bold text-slate-600 uppercase tracking-widest">Kritik</span>
                                    <span className="text-[15px] font-semibold text-slate-800 tabular-nums">{logs.filter(l => l.action.includes('DELETE') || l.action.includes('PERMISSION') || l.action.includes('SECURITY')).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[6px] p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[4px] bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                                <Database size={20} />
                            </div>
                            <div>
                                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Log Saklama Süresi</h5>
                                <p className="text-[14px] font-semibold text-slate-900 tracking-tight mt-0.5">180 Gün Aktif</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );

}
