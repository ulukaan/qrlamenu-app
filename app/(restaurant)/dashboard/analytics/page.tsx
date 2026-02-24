"use client";

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    DollarSign,
    ArrowUpRight,
    Package,
    Calendar,
    Loader2,
    RefreshCw,
    Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell
} from 'recharts';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const res = await fetch('/api/restaurant/analytics');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
        );
    }

    const stats = data?.stats || {};
    const revenueData = data?.revenueChart || [];
    const topProducts = data?.topProducts || [];

    const StatCard = ({ title, value, icon, iconBg, iconColor, trend }: any) => (
        <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 transition-all hover:shadow-2xl hover:shadow-gray-200/40 group flex flex-col gap-6">
            <div className="flex justify-between items-start">
                <div className={`w-16 h-16 rounded-[24px] ${iconBg} flex items-center justify-center shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(icon, { size: 28, className: iconColor, strokeWidth: 2.5 })}
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100/50">
                        <ArrowUpRight size={14} className="text-emerald-500" strokeWidth={3} />
                        <span className="text-[10px] font-black text-emerald-600 tracking-wider font-mono">{trend}</span>
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">{title}</h3>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="p-0 bg-[#f8fafc] min-h-screen">
            {/* Header / Sub-Header Area */}
            <div className="bg-white px-8 md:px-12 py-10 border-b-2 border-slate-50 relative z-30 shadow-sm shadow-slate-200/5 transition-all">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">ANALİTİK & RAPORLAR</h1>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">RESTORAN PERFORMANSINIZI CANLI TAKİP EDİN</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className="flex items-center gap-3 px-8 py-4 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-500 hover:border-gray-900 hover:text-gray-900 shadow-sm transition-all group"
                        >
                            <RefreshCw size={18} className={`${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} strokeWidth={3} />
                            YENİLE
                        </button>
                        <div className="bg-gray-900 text-white px-8 py-4 rounded-[24px] flex items-center gap-3 text-xs font-black tracking-widest shadow-xl shadow-gray-900/10 text-center">
                            <Calendar size={18} strokeWidth={3} />
                            SON 30 GÜN
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 lg:p-16">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        <StatCard
                            title="Toplam Gelir"
                            value={`${stats.totalRevenue?.toLocaleString('tr-TR')} ₺`}
                            icon={<DollarSign />}
                            iconBg="bg-orange-50"
                            iconColor="text-orange-500"
                            trend="+12.5%"
                        />
                        <StatCard
                            title="Toplam Sipariş"
                            value={stats.orderCount || 0}
                            icon={<ShoppingBag />}
                            iconBg="bg-blue-50"
                            iconColor="text-blue-500"
                            trend="+8.2%"
                        />
                        <StatCard
                            title="Aktif Siparişler"
                            value={stats.activeOrders || 0}
                            icon={<RefreshCw />}
                            iconBg="bg-amber-50"
                            iconColor="text-amber-500"
                        />
                        <StatCard
                            title="Ort. Sipariş Tutarı"
                            value={`${stats.avgOrderValue?.toFixed(2)} ₺`}
                            icon={<TrendingUp />}
                            iconBg="bg-emerald-50"
                            iconColor="text-emerald-500"
                        />
                    </div>

                    {/* Main Charts & Side Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Revenue Area Chart */}
                        <div className="lg:col-span-8 bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden flex flex-col">
                            <div className="p-10 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/20">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                        <TrendingUp size={20} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">GELİR ANALİZİ</h3>
                                </div>
                                <select className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black text-gray-500 outline-none focus:border-gray-900 transition-all uppercase tracking-widest cursor-pointer">
                                    <option>GÜNLÜK</option>
                                    <option>HAFTALIK</option>
                                </select>
                            </div>
                            <div className="p-10 flex-1">
                                <div className="h-[400px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ff7a21" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#ff7a21" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }}
                                                tickFormatter={(val) => format(new Date(val), 'dd MMM').toUpperCase()}
                                                dy={20}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }}
                                                tickFormatter={(val) => `${val}₺`}
                                                dx={-10}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                                                labelStyle={{ color: '#94a3b8', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px' }}
                                                formatter={(val: any) => [`${val.toLocaleString('tr-TR')} ₺`, 'GELİR']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#ff7a21"
                                                strokeWidth={5}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="lg:col-span-4 bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden flex flex-col">
                            <div className="p-10 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/20">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                        <Package size={20} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">EN ÇOK SATANLAR</h3>
                                </div>
                            </div>
                            <div className="p-10 flex-1 space-y-8">
                                {topProducts.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                            <Package size={32} className="text-gray-200" strokeWidth={2.5} />
                                        </div>
                                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest">HENÜZ VERİ BULUNMUYOR</p>
                                    </div>
                                ) : (
                                    topProducts.map((prod: any, idx: number) => (
                                        <div key={idx} className="group relative text-left">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xs border-2 border-transparent group-hover:border-orange-100 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all duration-300">
                                                    #{idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-gray-900 truncate tracking-tight text-sm uppercase">{prod.name}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{prod.quantity} ADET</span>
                                                        <div className="w-1.5 h-1.5 bg-gray-100 rounded-full" />
                                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{prod.revenue.toLocaleString('tr-TR')} ₺</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Progress bar background */}
                                            <div className="h-1.5 w-full bg-gray-50 rounded-full mt-4 overflow-hidden border border-gray-100/30">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(prod.revenue / topProducts[0].revenue) * 100}%` }}
                                                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-[#ff7a21] to-orange-400 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="px-10 pb-10 mt-auto">
                                <button className="w-full py-5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-[24px] border-2 border-gray-100 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-95">
                                    TÜM LİSTEYİ GÖR
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden">
                        <div className="p-10 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/20">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                    <ShoppingBag size={20} strokeWidth={3} />
                                </div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">SON İŞLEMLER</h3>
                            </div>
                            <button
                                onClick={() => window.open('/api/restaurant/analytics/export', '_blank')}
                                className="px-6 py-3 bg-white border-2 border-gray-100 rounded-xl text-[10px] font-black text-gray-500 hover:text-orange-500 hover:border-orange-100 transition-all uppercase tracking-widest"
                            >
                                DIŞA AKTAR (CSV)
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">İşlem ID</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Masa</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tutar</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Durum</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tarih</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-gray-50">
                                    {(data?.recentOrders || []).slice(0, 8).map((order: any) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-10 py-6 text-xs font-black text-gray-900 tracking-tighter">#{(order.id || '').slice(-6).toUpperCase()}</td>
                                            <td className="px-10 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">MASA {order.tableId || '-'}</td>
                                            <td className="px-10 py-6">
                                                <span className="text-sm font-black text-gray-900 tracking-tight">{order.totalAmount} ₺</span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                                    order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100/50' : 'bg-blue-50 text-blue-600 border-blue-100/50'
                                                    }`}>
                                                    {order.status === 'COMPLETED' ? 'TAMAMLANDI' : order.status === 'CANCELLED' ? 'İPTAL' : 'AKTİF'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {format(new Date(order.createdAt), 'dd.MM HH:mm')}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data?.recentOrders || data.recentOrders.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-20 text-center text-left">
                                                <p className="text-xs font-black text-gray-200 uppercase tracking-[0.3em]">HENÜZ İŞLEM BULUNMUYOR</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper formatting function for the component
function format(date: Date, str: string) {
    // Simple mock for date-fns if not used directly
    const pad = (n: number) => n.toString().padStart(2, '0');
    const months = ['Ocak', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

    if (str === 'dd MMM') {
        return `${pad(date.getDate())} ${months[date.getMonth()]}`;
    }
    if (str === 'dd.MM HH:mm') {
        return `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
    return date.toISOString();
}
