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
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
                <Loader2 size={48} className="animate-spin text-[#ff7a21]" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sistem Verileri Senkronize Ediliyor...</p>
            </div>
        );
    }

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
        { title: 'Toplam Restoran', value: data.totalRestaurants, icon: <Store size={22} />, color: '#ff7a21', trend: '+12%' },
        { title: 'Aktif Premium', value: data.activePremium, icon: <CreditCard size={22} />, color: '#4caf50', trend: '+5%' },
        { title: 'Toplam Üye', value: data.totalUsers, icon: <Users size={22} />, color: '#2196f3', trend: '+24%' },
        { title: 'Aylık Gelir', value: `₺${data.monthlyRevenue.toLocaleString('tr-TR')}`, icon: <TrendingUp size={22} />, color: '#9c27b0', trend: '+18%' },
    ];

    return (
        <div className="p-4 md:p-10 w-full max-w-full">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Sistem Kontrol Merkezi</h2>
                    <p className="text-gray-500 mt-1 text-sm font-medium">Platform veri akışı, büyüme performansı ve sistem sağlığı analitiği.</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 outline-none cursor-pointer shadow-sm">
                            <option>Son 30 Günlük Veri</option>
                            <option>Son 7 Günlük Veri</option>
                            <option>Bugünün Özeti</option>
                        </select>
                    </div>
                    <button
                        onClick={() => router.push('/super-admin/restoranlar/yeni')}
                        className="flex-1 sm:flex-initial bg-[#ff7a21] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Yeni Restoran Kaydı
                    </button>
                </div>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div className="bg-white rounded-[32px] p-8 relative overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-500 cursor-default" key={idx}>
                        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full transition-all duration-700 group-hover:scale-150" style={{ background: `${stat.color}05` }}></div>
                        <div className="flex justify-between items-start relative">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: stat.color }}></div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">{stat.title}</p>
                                </div>
                                <h3 className="m-0 text-3xl font-black text-gray-900 tracking-tighter leading-none group-hover:text-[#ff7a21] transition-colors">{stat.value}</h3>
                                <div className="mt-4 flex items-center gap-1.5">
                                    <div className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-black tracking-widest ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-500 shadow-sm shadow-emerald-500/10' : 'bg-rose-50 text-rose-500 shadow-sm shadow-rose-500/10'}`}>
                                        {stat.trend.startsWith('+') ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                                        <span className="ml-0.5">{stat.trend}</span>
                                    </div>
                                    <span className="text-slate-300 font-bold text-[9px] uppercase tracking-tighter italic">büyüme endeksi</span>
                                </div>
                            </div>
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 relative group-hover:scale-110 transition-all duration-500"
                                style={{ background: `${stat.color}08`, color: stat.color }}
                            >
                                <div className="absolute inset-0 bg-white opacity-40 rounded-2xl"></div>
                                <div className="relative">
                                    {React.cloneElement(stat.icon as any, { size: 24, strokeWidth: 2.5 })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Orta Bölüm: Grafikler ve Sağ Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 mb-8">
                <div className="flex flex-col gap-8">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#fff7ed] p-2 rounded-xl">
                                    <TrendingUp size={20} className="text-[#ff7a21]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Finansal Gelir Analizi</h3>
                                    <p className="mt-1 text-xs text-slate-400 font-semibold">Platform genelinde aylık brüt kazanç akışı.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#f8fafc] rounded-lg border border-slate-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a21] shadow-[0_0_8px_rgba(255,122,33,0.5)]"></div>
                                <span className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider">Canlı Senkronizasyon</span>
                            </div>
                        </div>
                        <div className="w-full h-[300px] md:h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.revenueHistory}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff7a21" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#ff7a21" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                                        itemStyle={{ fontSize: '0.9rem', fontWeight: '900', color: '#111827' }}
                                        cursor={{ stroke: '#ff7a21', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#ff7a21" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 4, fill: '#fff', stroke: '#ff7a21', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#ff7a21', stroke: '#fff', strokeWidth: 3 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Son Kayıtlar */}
                    <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 flex flex-col">
                        <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-50 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#ff7a21]">
                                    <Activity size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Yeni Katılan İşletmeler</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-0.5">Sisteme en son kayıt olan 5 restoran.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/super-admin/restoranlar')}
                                className="bg-slate-900 text-white font-black text-[10px] px-6 py-3 rounded-xl hover:bg-[#ff7a21] transition-all uppercase tracking-widest shadow-lg shadow-slate-900/10 active:scale-95"
                            >
                                Tümünü Yönet
                            </button>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">İşletme Kimliği</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Lisans Paketi</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Durum</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Kayıt Tarihi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data.recentRestaurants.map((res: any, idx: number) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-[#ff7a21] group-hover:text-white transition-all shadow-sm">
                                                        {res.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-gray-900 group-hover:text-[#ff7a21] transition-colors">{res.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                                                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                            {res.city || 'İstanbul'} • Türkiye
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-white text-slate-500 border border-slate-100 shadow-sm uppercase tracking-tighter">
                                                    {res.plan}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${res.status === 'Aktif' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${res.status === 'Aktif' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        {res.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-[11px] font-black text-slate-300 tracking-tighter">
                                                    {new Date(res.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                                    <span className="ml-1 text-[9px] font-bold opacity-50">/ {new Date(res.date).getFullYear()}</span>
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
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-900/10">
                        <div className="flex items-center gap-3 mb-8">
                            <Activity size={20} className="text-[#4ade80]" />
                            <h3 className="text-xs font-black uppercase tracking-widest">Platform Sağlığı</h3>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>
                                <div className="flex justify-between text-[11px] font-bold mb-2.5">
                                    <span className="text-slate-400">API Ortalama Yanıt</span>
                                    <span className="text-[#4ade80]">42ms</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-[85%] h-full bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.3)]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] font-bold mb-2.5">
                                    <span className="text-slate-400">Kullanılan Kapasite</span>
                                    <span className="text-[#fbbf24]">%4.2</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-[12%] h-full bg-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.3)]"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <Database size={18} className="text-[#3b82f6]" />
                                <div>
                                    <p className="text-[11px] font-black text-white">Cluster Durumu</p>
                                    <p className="mt-0.5 text-[10px] text-[#4ade80] font-extrabold uppercase tracking-wide">BAĞLI & OPTİMİZE</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-[#f5f3ff] p-2 rounded-xl">
                                <BarChart3 size={20} className="text-[#6366f1]" />
                            </div>
                            <h3 className="text-base font-black text-gray-900 tracking-tight">Büyüme Eğrisi</h3>
                        </div>
                        <div className="w-full h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.signupHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '0.75rem' }} />
                                    <Bar dataKey="value" fill="#1e293b" radius={[6, 6, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="mt-6 text-[10px] text-slate-400 text-center font-bold italic">Son 7 gündeki yeni işletme kayıtları.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
