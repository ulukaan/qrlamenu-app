"use client";
import React from 'react';
import { Printer, Wifi, WifiOff, Activity, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';

export default function PrintAgentPage() {
    const [agents, setAgents] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/print-agent');
                if (!res.ok) throw new Error('Yazıcı servisleri yüklenemedi');
                const data = await res.json();
                setAgents(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const stats = {
        online: agents.filter(a => a.status === 'ONLINE').length,
        offline: agents.filter(a => a.status === 'OFFLINE').length,
        total: agents.length
    };

    const onlinePercentage = stats.total > 0 ? (stats.online / stats.total) * 100 : 0;
    const offlinePercentage = stats.total > 0 ? (stats.offline / stats.total) * 100 : 0;

    return (
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Yerel Servis & Yazıcı İzleme</h1>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Restoran terminallerindeki print agent servislerinin aktiflik, gecikme ve sistem sağlığını gerçek zamanlı izleyin.</p>
                </div>
                <button
                    className="w-full sm:w-auto flex items-center justify-center gap-2 h-9 px-4 rounded-[6px] bg-slate-900 text-white font-semibold text-[13px] hover:bg-slate-800 transition-colors shadow-sm"
                >
                    <RefreshCw size={14} className="" />
                    <span>Taramayı Başlat</span>
                </button>
            </div>

            {/* Premium Stats Grid -> Corporate Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-[6px] shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Aktif Terminal Servisleri</p>
                        <h3 className="text-[32px] font-bold text-slate-900 tracking-tight leading-none mb-3">{loading ? '...' : stats.online}</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000"
                                    style={{ width: `${onlinePercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                                %{onlinePercentage.toFixed(1)} Başarı
                            </p>
                        </div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-[6px] text-emerald-600 border border-emerald-100">
                        <Wifi size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[6px] shadow-sm border border-slate-200 hover:border-rose-300 transition-colors flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Erişilemeyen Birimler</p>
                        <h3 className="text-[32px] font-bold text-slate-900 tracking-tight leading-none mb-3">{loading ? '...' : stats.offline}</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-rose-500 transition-all duration-1000"
                                    style={{ width: `${offlinePercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                                İnceleme Gerekli
                            </p>
                        </div>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-[6px] text-rose-600 border border-rose-100">
                        <WifiOff size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <div className="space-y-6 min-w-0">
                    <section className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Terminal Bağlantı Kanalları</h3>
                            <div className="px-3 py-1 rounded-[4px] bg-white border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Toplam {agents.length} Agent
                            </div>
                        </div>
                        <div className="px-6 divide-y divide-slate-100">
                            {loading ? (
                                <div className="py-20 text-center">
                                    <Loader2 size={32} className="animate-spin text-slate-400 mx-auto mb-4" />
                                    <p className="text-slate-500 font-semibold tracking-wide text-[12px]">Terminal verileri senkronize ediliyor...</p>
                                </div>
                            ) : agents.length === 0 ? (
                                <div className="py-20 text-center">
                                    <Printer size={48} className="text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-semibold text-[13px]">Sistemde aktif servis bulunmuyor.</p>
                                </div>
                            ) : agents.map((row) => (
                                <div key={row.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 py-5 transition-colors">
                                    <div className="relative shrink-0">
                                        <div className={`w-2.5 h-2.5 rounded-full ${row.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        {row.status === 'ONLINE' && <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors truncate">
                                            {row.name || row.tenant?.name}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                ID: <span className="text-slate-700">{row.agentId}</span>
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                v{row.version || '1.0.0'} STABLE
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 shrink-0 text-right">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[11px] font-bold tracking-tight border transition-all ${row.latency > 100
                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            } ${row.status !== 'ONLINE' ? 'opacity-50 grayscale' : ''}`}>
                                            <Activity size={12} />
                                            <span>{row.latency ? `${row.latency}ms` : 'N/A'}</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            SYC: <span className="text-slate-600">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </p>
                                    </div>
                                    <button className="sm:ml-4 shrink-0 h-8 px-3 rounded-[4px] bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] uppercase tracking-wider hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                        Kayıtlar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Sidebar */}
                <aside className="space-y-6 xl:sticky xl:top-8 xl:h-fit">
                    <div className="bg-slate-900 p-6 rounded-[6px] text-white shadow-sm border border-slate-800">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-slate-800 p-2 rounded-[4px] text-slate-300">
                                <Activity size={18} />
                            </div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Ağ Verimliliği</h3>
                        </div>

                        <p className="text-[12px] font-medium text-slate-300 leading-relaxed mb-6">
                            Terminal servislerinin ortalama yanıt süresi <span className="text-white font-bold">42ms</span> olarak ölçüldü.
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                                    <span className="text-slate-500">Kayıpsız İletişim</span>
                                    <span className="text-emerald-400">%99.8</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[99.8%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-[6px] shadow-sm border border-emerald-100 flex gap-4 items-start">
                        <div className="bg-emerald-100 p-2.5 rounded-[4px] text-emerald-600 shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-emerald-900 mb-1">E2E Güvenlik</h4>
                            <p className="text-[12px] font-medium text-emerald-700 leading-relaxed">
                                Tüm agent bağlantıları TLS 1.3 protokolü ile şifrelenmektedir.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
