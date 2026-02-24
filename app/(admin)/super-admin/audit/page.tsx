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
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Sayfa Üst Bilgisi */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        Sistem Denetim İzleri
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-medium leading-relaxed">
                        Platform üzerindeki kritik yönetimsel işlemlerin güvenlik kayıtları ve işlem geçmişi.
                    </p>
                </div>
                <div className="w-full xl:w-auto">
                    <div className="relative group">
                        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff7a21] transition-colors" />
                        <input
                            type="text"
                            placeholder="Eylem, admin veya IP..."
                            className="w-full xl:w-[480px] pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-white/50 backdrop-blur-xl focus:border-[#ff7a21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-gray-700 shadow-sm"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 items-start">
                <div className="space-y-8 min-w-0">
                    {/* Denetim Kayıtları */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-3 rounded-2xl border-2 border-gray-100 text-[#ff7a21] shadow-sm">
                                    <Database size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Olay Akışı</h3>
                            </div>
                            <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-50 text-[#ff7a21] text-[10px] font-black uppercase tracking-[0.2em] border-2 border-orange-100 hover:bg-[#ff7a21] hover:text-white transition-all active:scale-95 shadow-sm">
                                DIŞA AKTAR (.CSV)
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Zaman Damgası</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Aktör</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Eylem</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Detay</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Kaynak IP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-40 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Loader2 size={48} className="animate-spin text-[#ff7a21]" />
                                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Denetim Veritabanı Senkronize Ediliyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-40 text-center">
                                                <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-200 border-2 border-gray-100 shadow-inner">
                                                    <Database size={48} strokeWidth={1} />
                                                </div>
                                                <p className="text-gray-400 font-bold text-lg italic tracking-tight">Henüz bir denetim kaydı bulunmuyor.</p>
                                            </td>
                                        </tr>
                                    ) : logs.map((log) => (
                                        <tr key={log.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <div className="flex items-center gap-3 text-xs font-black text-gray-900 tabular-nums">
                                                    <Clock size={16} className="text-gray-300 group-hover:text-[#ff7a21] transition-colors" strokeWidth={2.5} />
                                                    {new Date(log.createdAt).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-[#ff7a21] transition-all shadow-sm">
                                                        <User size={16} strokeWidth={2.5} />
                                                    </div>
                                                    <span className="text-xs font-black text-gray-900 truncate max-w-[140px] leading-tight">{log.adminEmail || 'Sistem'}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`text-[9px] font-black px-4 py-2 rounded-xl border-2 uppercase tracking-widest transition-all ${log.action.includes('CREATE') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        log.action.includes('UPDATE') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            log.action.includes('DELETE') ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                'bg-gray-50 text-gray-500 border-gray-100'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 max-w-xs xl:max-w-md">
                                                <div className="flex items-center gap-3 group/info">
                                                    <Info size={16} className="text-gray-200 shrink-0 group-hover/info:text-[#ff7a21] transition-colors" />
                                                    <span className="text-xs text-gray-500 font-bold leading-relaxed italic truncate">{log.details}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className="font-mono text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm group-hover:border-orange-200 group-hover:text-[#ff7a21] transition-colors">{log.ipAddress || '127.0.0.1'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="space-y-8 xl:sticky xl:top-8 xl:h-fit">
                    <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-[#ff7a21]/10 rounded-full blur-[80px] transition-transform duration-1000 group-hover:scale-125"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="bg-orange-500/10 p-4 rounded-3xl border-2 border-orange-500/10 shadow-lg">
                                    <Shield size={28} className="text-[#ff7a21]" strokeWidth={3} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Bütünlük Koruması</h3>
                            </div>

                            <p className="text-sm font-bold text-slate-400 leading-relaxed italic mb-8">
                                Audit logları salt-okunur olarak tutulur ve geriye dönük silinemez. Tüm kayıtlar <span className="text-white font-black underline decoration-[#ff7a21]/50 underline-offset-4">SHA-256</span> hash zinciri ile korunur.
                            </p>

                            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                Koruma Aktif
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Search size={16} className="text-[#ff7a21]" /> Hızlı Filtrele
                        </h4>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Zaman Aralığı</label>
                                <div className="relative">
                                    <select className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 text-xs font-black text-gray-800 focus:bg-white focus:border-[#ff7a21] transition-all outline-none appearance-none cursor-pointer pr-12 shadow-sm">
                                        <option>Son 24 Saat</option>
                                        <option>Son 7 Gün</option>
                                        <option>Son 30 Gün</option>
                                        <option>Tüm Zamanlar</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <Clock size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-10 border-t border-gray-50">
                                <div className="flex justify-between items-center p-6 bg-emerald-50/50 rounded-3xl border-2 border-emerald-100 shadow-sm transition-all hover:bg-emerald-50">
                                    <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.1em]">Bugün</span>
                                    <span className="text-2xl font-black text-emerald-700 tabular-nums">{logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}</span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-rose-50/50 rounded-3xl border-2 border-rose-100 shadow-sm transition-all hover:bg-rose-50">
                                    <span className="text-xs font-black text-rose-600 uppercase tracking-[0.1em]">Kritik</span>
                                    <span className="text-2xl font-black text-rose-700 tabular-nums">{logs.filter(l => l.action.includes('DELETE') || l.action.includes('PERMISSION') || l.action.includes('SECURITY')).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[24px] bg-orange-50 border-2 border-orange-100 flex items-center justify-center text-[#ff7a21] shadow-inner group-hover:scale-110 transition-transform">
                                <Database size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Log Saklama Süresi</h5>
                                <p className="text-lg font-black text-gray-900 tracking-tight leading-none italic uppercase">180 Gün Aktif</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );

}
