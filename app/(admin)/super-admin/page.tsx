"use client";
import React, { useState, useEffect } from 'react';
import {
    Users,
    CreditCard,
    TrendingUp,
    Store,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    BarChart3,
    Activity,
    Database,
    Loader2,
    ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/ui/stat-card';
import { LoadingScreen } from '@/components/ui/loading-screen';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

export default function SuperAdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const jsonData = await res.json();
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingScreen message="GÖSTERGE PANELİ YÜKLENİYOR" />;

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-10">
                <div className="bg-rose-50 p-10 rounded-[40px] border border-rose-100 text-center max-w-md">
                    <Activity size={48} className="text-rose-500 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-rose-600 mb-2">Veri Bağlantı Hatası</h3>
                    <p className="text-sm font-bold text-rose-400">Sunucu ile bağlantı kurulamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
                </div>
            </div>
        );
    }

    const stats = [
        { title: 'Toplam Restoran', value: data.totalRestaurants, icon: <Store size={22} />, color: '#ea580c', trend: '+12%' },
        { title: 'Aktif Premium', value: data.activePremium, icon: <CreditCard size={22} />, color: '#4caf50', trend: '+5%' },
        { title: 'Toplam Üye', value: data.totalUsers, icon: <Users size={22} />, color: '#2196f3', trend: '+24%' },
        { title: 'Aylık Gelir', value: `₺${data.monthlyRevenue.toLocaleString('tr-TR')}`, icon: <TrendingUp size={22} />, color: '#9c27b0', trend: '+18%' },
    ];

    return (
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                        <span>PANEL</span>
                        <ChevronRight size={8} className="text-slate-300" />
                        <span className="text-slate-900">GÖSTERGE PANELİ</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">
                            Genel Bakış
                        </h1>
                    </div>
                    <p className="text-[13px] font-medium text-slate-500">Platform veri akışı, büyüme performansı ve sistem sağlığı analitiği.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex bg-white h-9 px-4 rounded-[6px] border border-slate-200 items-center gap-3 shadow-sm transition-all hover:border-slate-300">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-[12px] font-bold text-slate-900 leading-none">Canlı Takip Aktif</p>
                    </div>
                    <button
                        onClick={() => router.push('/super-admin/restoranlar/yeni')}
                        className="h-9 bg-slate-900 text-white px-4 rounded-[6px] text-[13px] font-semibold hover:bg-slate-800 transition-all shadow-sm"
                    >
                        Yeni Restoran Kaydı
                    </button>
                    <div className="relative min-w-[160px]">
                        <select className="w-full h-9 pl-3 pr-8 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 outline-none cursor-pointer shadow-sm hover:border-slate-300 transition-all appearance-none">
                            <option>Son 30 Günlük Veri</option>
                            <option>Son 7 Günlük Veri</option>
                            <option>Bugünün Özeti</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                </div>
            </header>

            <div className="h-px bg-slate-200/60 w-full mb-10" />

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="TOPLAM RESTORAN"
                    value={data.totalRestaurants?.toString() || "0"}
                    subtitle="+12% büyüme endeksi"
                />
                <StatCard
                    title="AKTİF PREMİUM"
                    value={data.activePremium?.toString() || "0"}
                    subtitle="+5% büyüme endeksi"
                />
                <StatCard
                    title="TOPLAM ÜYE"
                    value={data.totalUsers?.toString() || "0"}
                    subtitle="+24% büyüme endeksi"
                />
                <StatCard
                    title="AYLIK GELİR"
                    value={`₺${(data.monthlyRevenue || 0).toLocaleString('tr-TR')}`}
                    subtitle="+18% büyüme endeksi"
                />
            </div>

            {/* Orta Bölüm: Grafikler ve Sağ Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 mb-8">
                <div className="flex flex-col gap-8">
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 py-4 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-[4px] flex items-center justify-center border border-orange-100/50">
                                    <TrendingUp size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Finansal Gelir Analizi</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Platform genelinde aylık brüt kazanç akışı.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#f8fafc] rounded-[4px] border border-slate-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c] shadow-[0_0_8px_rgba(255,122,33,0.5)]"></div>
                                <span className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider">Canlı Senkronizasyon</span>
                            </div>
                        </div>
                        <div className="p-4 flex-1 w-full relative">
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.revenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dx={-5} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '12px' }}
                                            itemStyle={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}
                                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 3, fill: '#fff', stroke: '#ea580c', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Son Kayıtlar */}
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 py-4 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-[4px] flex items-center justify-center border border-orange-100/50">
                                    <Activity size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Yeni Katılan İşletmeler</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sisteme en son kayıt olan 5 restoran.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/super-admin/restoranlar')}
                                className="h-8 bg-slate-900 text-white px-3 rounded-[4px] text-[12px] font-semibold hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2"
                            >
                                Tümünü Yönet
                                <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full">
                                <thead className="bg-[#f8fafc] border-b border-slate-200/60">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">İşletme Kimliği</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lisans Paketi</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                                        <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kayıt Tarihi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.recentRestaurants.map((res: any, idx: number) => (
                                        <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-[4px] bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {res.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-slate-900">{res.name}</div>
                                                        <div className="text-[11px] text-slate-500 mt-0.5">
                                                            {res.city || 'İstanbul'} • Türkiye
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tight">
                                                    {res.plan}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${res.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                    <span className={`text-[12px] font-medium ${res.status === 'Aktif' ? 'text-slate-900' : 'text-slate-500'}`}>
                                                        {res.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="text-[12px] font-medium text-slate-600">
                                                    {new Date(res.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                                    <span className="ml-1 text-[11px] text-slate-400">/ {new Date(res.date).getFullYear()}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Platform Sağlığı */}
                    <div className="bg-slate-900 rounded-[6px] p-6 text-white shadow-sm border border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity size={18} className="text-[#4ade80]" />
                            <h3 className="text-[13px] font-semibold uppercase tracking-tight">Platform Sağlığı</h3>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div>
                                <div className="flex justify-between text-[12px] font-medium mb-2.5">
                                    <span className="text-slate-400">API Ortalama Yanıt</span>
                                    <span className="text-[#4ade80]">42ms</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[85%] h-full bg-[#4ade80]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[12px] font-medium mb-2.5">
                                    <span className="text-slate-400">Kullanılan Kapasite</span>
                                    <span className="text-[#fbbf24]">%4.2</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[12%] h-full bg-[#fbbf24]"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-2 p-3 bg-white/5 rounded-[6px] border border-white/10">
                                <Database size={16} className="text-[#3b82f6]" />
                                <div>
                                    <p className="text-[12px] font-semibold text-white">Cluster Durumu</p>
                                    <p className="text-[10px] text-[#4ade80] font-bold uppercase tracking-wider mt-0.5">BAĞLI & OPTİMİZE</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[6px] p-6 shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-[4px] flex items-center justify-center border border-indigo-100/50">
                                <BarChart3 size={16} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Büyüme Eğrisi</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Son 7 günlük yeni işletme kayıtları.</p>
                            </div>
                        </div>
                        <div className="w-full h-[200px] flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.signupHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.75rem', padding: '12px' }} />
                                    <Bar dataKey="value" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
