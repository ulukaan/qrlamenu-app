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
    RefreshCw
} from 'lucide-react';
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
import { motion } from 'framer-motion';

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

    const StatCard = ({ title, value, icon, color, trend }: any) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    {icon}
                </div>
                {trend && (
                    <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                        <ArrowUpRight size={14} className="mr-0.5" /> {trend}
                    </span>
                )}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Analitik & Raporlar</h1>
                        <p className="text-slate-500">Restoran performansınızı gerçek zamanlı takip edin.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                            Yenile
                        </button>
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
                            <Calendar size={18} />
                            Son 30 Gün
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Toplam Gelir"
                        value={`${stats.totalRevenue?.toLocaleString('tr-TR')} ₺`}
                        icon={<DollarSign size={24} />}
                        color="bg-orange-500"
                        trend="+12.5%"
                    />
                    <StatCard
                        title="Toplam Sipariş"
                        value={stats.orderCount || 0}
                        icon={<ShoppingBag size={24} />}
                        color="bg-indigo-500"
                        trend="+8.2%"
                    />
                    <StatCard
                        title="Aktif Siparişler"
                        value={stats.activeOrders || 0}
                        icon={<RefreshCw size={24} />}
                        color="bg-amber-500"
                    />
                    <StatCard
                        title="Ort. Sipariş Tutarı"
                        value={`${stats.avgOrderValue?.toFixed(2)} ₺`}
                        icon={<TrendingUp size={24} />}
                        color="bg-emerald-500"
                    />
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900 text-lg">Gelir Grafiği (Son 7 Gün)</h3>
                            <select className="bg-slate-50 border-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 outline-none">
                                <option>Günlük</option>
                                <option>Haftalık</option>
                            </select>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) => format(new Date(val), 'dd MMM')}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) => `${val} ₺`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(val: any) => [`${val.toLocaleString('tr-TR')} ₺`, 'Gelir']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 text-lg mb-6">En Çok Satanlar</h3>
                        <div className="space-y-6">
                            {topProducts.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <Package size={40} className="mx-auto mb-2 opacity-20" />
                                    <p>Henüz veri yok</p>
                                </div>
                            ) : (
                                topProducts.map((prod: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-slate-500">{prod.quantity} Satış</span>
                                                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="text-xs font-bold text-orange-600">{prod.revenue.toLocaleString('tr-TR')} ₺</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-orange-500"
                                                style={{ width: `${(prod.revenue / topProducts[0].revenue) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="w-full mt-10 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                            Tüm Listeyi Gör
                        </button>
                    </div>
                </div>

                {/* Recent Activity Table Mock */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-lg">Son İşlemler</h3>
                        <button
                            onClick={() => window.open('/api/restaurant/analytics/export', '_blank')}
                            className="text-orange-500 text-sm font-bold hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Dışa Aktar (CSV)
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">İşlem ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Masa</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutar</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tarih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {(data?.recentOrders || []).slice(0, 5).map((order: any) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">#{order.id.slice(-6)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">Masa {order.tableId || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.totalAmount} ₺</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                                                order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {format(new Date(order.createdAt), 'dd.MM HH:mm')}
                                        </td>
                                    </tr>
                                ))}
                                {(!data?.recentOrders || data.recentOrders.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Yakın zamanda işlem bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
