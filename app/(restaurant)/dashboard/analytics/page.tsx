"use client";
import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    RefreshCw,
    Calendar,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Download,
    Filter,
    Activity,
    Clock,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';
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
import { StatCard as CompactStatCard } from '@/components/ui/stat-card';
import { LoadingScreen } from '@/components/ui/loading-screen';

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

    if (loading) return <LoadingScreen message="ANALİTİK VERİLERİ OKUNUYOR" />;

    const stats = data?.stats || {};
    const revenueData = data?.revenueChart || [];
    const topProducts = data?.topProducts || [];

    const StatCard = ({ title, value, trend }: any) => (
        <CompactStatCard
            title={title}
            value={value}
            subtitle={trend ? `Son 30 gün: ${trend}` : undefined}
            statusLabel="Aktif"
        />
    );

    return (
        <div className="px-6 py-8 bg-[#f8fafc] min-h-screen">
            {/* Header Area */}
            <div className="bg-white px-6 py-6 border-b-2 border-slate-50 relative z-30 transition-all mb-8 rounded-[6px] shadow-sm">
                <div className="w-full mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <MobileMenuToggle />
                            <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Analitik & Raporlar</h1>
                        </div>
                        <p className="text-[13px] font-medium text-slate-500">Restoran performansınızı ve veri trendlerini analiz edin.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className="flex items-center gap-2 h-9 px-4 bg-white border border-[#E2E8F0] rounded-[6px] text-[12px] font-semibold text-slate-600 hover:border-slate-300 shadow-sm transition-all group"
                        >
                            <RefreshCw size={14} className={`${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} strokeWidth={2.2} />
                            YENİLE
                        </button>
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            <div className="px-0">
                <div className="w-full mx-auto space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        <StatCard
                            title="TOPLAM GELİR"
                            value={`${stats.totalRevenue?.toLocaleString('tr-TR')} ₺`}
                            trend="+12.5%"
                        />
                        <StatCard
                            title="SİPARİŞ HACMİ"
                            value={stats.orderCount || 0}
                            trend="+8.2%"
                        />
                        <StatCard
                            title="ORT. SEPET"
                            value={`${stats.avgOrderValue?.toFixed(2)} ₺`}
                            trend="+5.1%"
                        />
                        <StatCard
                            title="MASA DOLULUĞU"
                            value="%74"
                            trend="+14%"
                        />
                    </div>

                    {/* Main Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Revenue Trend */}
                        <div className="lg:col-span-8 bg-white rounded-[6px] shadow-sm border border-slate-200/60 flex flex-col">
                            <div className="px-4 py-4 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-[4px] flex items-center justify-center border border-orange-100/50">
                                        <TrendingUp size={18} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Gelir Trendi</h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ff7a21" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#ff7a21" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} tickFormatter={(val) => format(new Date(val), 'dd MMM').toUpperCase()} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dx={-10} tickFormatter={(val) => `${val}₺`} />
                                            <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', padding: '12px' }} />
                                            <Area type="monotone" dataKey="amount" stroke="#ff7a21" strokeWidth={3} fill="url(#colorRev)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Top Products Compact */}
                        <div className="lg:col-span-4 bg-white rounded-[6px] shadow-sm border border-slate-200/60 flex flex-col">
                            <div className="px-4 py-4 border-b border-slate-50">
                                <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Ürün Kırılımı</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {topProducts.slice(0, 5).map((prod: any, idx: number) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-slate-500">
                                            <span>{prod.name}</span>
                                            <span>{prod.quantity} Satış</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/30">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(prod.quantity / topProducts[0].quantity) * 100}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className="h-full bg-orange-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Data Visualization */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Hourly Heatmap/Bar */}
                        <div className="bg-white rounded-[6px] shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
                            <div className="px-4 py-4 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Saatlik Yoğunluk</h3>
                                <Clock size={16} className="text-slate-400" />
                            </div>
                            <div className="p-4">
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.hourlyDensity || []}>
                                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                            <Bar dataKey="count" fill="#ff7a21" radius={[2, 2, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions Table */}
                        <div className="bg-white rounded-[6px] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                            <div className="px-4 py-4 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Kritik İşlemler</h3>
                                <button className="text-[10px] font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest">Tümünü Gör</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-slate-50">
                                        {(data?.recentOrders || []).slice(0, 5).map((order: any) => (
                                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="text-[12px] font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Masa {order.tableId}</p>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <p className="text-[13px] font-bold text-slate-900">{order.totalAmount.toLocaleString('tr-TR')} ₺</p>
                                                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">{order.status}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
