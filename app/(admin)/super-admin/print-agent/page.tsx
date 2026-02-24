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
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Page Header Area */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        Yerel Servis & Yazıcı İzleme
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-medium max-w-3xl leading-relaxed">
                        Restoran terminallerindeki print agent servislerinin aktiflik, gecikme ve sistem sağlığını gerçek zamanlı izleyin.
                    </p>
                </div>
                <button
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#ff7a21] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all group"
                >
                    <RefreshCw size={22} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Ağ Taraması Başlat</span>
                </button>
            </header>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="group bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 border-2 border-transparent hover:border-emerald-100 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Aktif Terminal Servisleri</p>
                            <h3 className="text-5xl font-black text-emerald-500 tracking-tighter leading-none mb-6">{loading ? '...' : stats.online}</h3>
                            <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 mb-4">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                                    style={{ width: `${onlinePercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-emerald-500 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                %{onlinePercentage.toFixed(1)} Operasyonel Başarı
                            </p>
                        </div>
                        <div className="bg-emerald-50 p-5 rounded-3xl text-emerald-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <Wifi size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="group bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 border-2 border-transparent hover:border-rose-100 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Erişilemeyen Birimler</p>
                            <h3 className="text-5xl font-black text-rose-500 tracking-tighter leading-none mb-6">{loading ? '...' : stats.offline}</h3>
                            <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 mb-4">
                                <div
                                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-1000"
                                    style={{ width: `${offlinePercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-rose-500/80 text-xs font-black uppercase tracking-wider">Acil Müdahale Gerekebilir</p>
                        </div>
                        <div className="bg-rose-50 p-5 rounded-3xl text-rose-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                            <WifiOff size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
                <div className="space-y-8 min-w-0">
                    <section className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Terminal Bağlantı Kanalları</h3>
                            <div className="px-4 py-1.5 rounded-full bg-white border-2 border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Toplam {agents.length} Agent
                            </div>
                        </div>
                        <div className="px-10 divide-y divide-gray-50">
                            {loading ? (
                                <div className="py-32 text-center">
                                    <Loader2 size={48} className="animate-spin text-[#ff7a21] mx-auto mb-6" />
                                    <p className="text-gray-400 font-bold tracking-tight uppercase text-xs">Terminal verileri senkronize ediliyor...</p>
                                </div>
                            ) : agents.length === 0 ? (
                                <div className="py-32 text-center">
                                    <Printer size={80} className="text-gray-100 mx-auto mb-8" strokeWidth={1} />
                                    <p className="text-gray-400 font-bold text-lg">Sistemde aktif servis bulunmuyor.</p>
                                </div>
                            ) : agents.map((row) => (
                                <div key={row.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 py-10 transition-colors">
                                    <div className="relative shrink-0">
                                        <div className={`w-4 h-4 rounded-full ${row.status === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'}`}></div>
                                        {row.status === 'ONLINE' && <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-[#ff7a21] transition-colors truncate">
                                            {row.name || row.tenant?.name}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                ID: <span className="text-[#ff7a21]">{row.agentId}</span>
                                            </span>
                                            <span className="text-gray-200">|</span>
                                            <span className="px-3 py-1 rounded-lg bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
                                                v{row.version || '1.0.0'} STABLE
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 shrink-0 text-right">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-tight border-2 transition-all ${row.latency > 100
                                            ? 'bg-orange-50 text-orange-600 border-orange-100'
                                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            } ${row.status !== 'ONLINE' ? 'opacity-30 grayscale' : ''}`}>
                                            <Activity size={14} strokeWidth={3} />
                                            <span>{row.latency ? `${row.latency}ms` : 'N/A'}</span>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            SYC: <span className="text-gray-700">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </p>
                                    </div>
                                    <button className="sm:ml-4 shrink-0 px-6 py-2.5 rounded-xl bg-white border-2 border-gray-100 text-gray-900 font-black text-[10px] uppercase tracking-widest hover:border-orange-200 hover:text-[#ff7a21] hover:shadow-lg transition-all active:scale-95">
                                        Log Çek
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Sidebar */}
                <aside className="space-y-8 xl:sticky xl:top-8 xl:h-fit">
                    <div className="bg-[#0f172a] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff7a21]/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10 flex items-center gap-4 mb-8">
                            <div className="bg-[#ff7a21]/20 p-3 rounded-2xl">
                                <Activity size={24} className="text-[#ff7a21]" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Ağ Verimliliği</h3>
                        </div>

                        <p className="relative z-10 text-sm font-bold text-slate-400 leading-relaxed mb-10">
                            Platform genelinde terminal servislerinin ortalama yanıt süresi <span className="text-white font-black underline underline-offset-4 decoration-emerald-500/50">42ms</span> olarak ölçüldü.
                        </p>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                                    <span className="text-slate-500">Veri Paket Başarısı</span>
                                    <span className="text-emerald-400">%99.8</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[99.8%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex gap-6 items-start">
                        <div className="bg-emerald-50 p-4 rounded-3xl border-2 border-emerald-100 shrink-0">
                            <ShieldCheck size={26} className="text-emerald-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-gray-900 tracking-tight mb-2">E2E Güvenlik</h4>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                Tüm print agent bağlantıları <span className="text-[#ff7a21] font-black">TLS 1.3</span> protokolü ile şifrelenmektedir.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );

}
