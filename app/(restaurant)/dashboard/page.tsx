"use client";
import React from 'react';
import {
    Activity,
    BarChart2,
    UtensilsCrossed,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Recharts to avoid SSR mismatch affecting global CSS loading
const RechartsLineChart = dynamic(
    () => import('recharts').then(mod => mod.LineChart),
    { ssr: false }
);
const RechartsLine = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const RechartsXAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const RechartsYAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const RechartsCartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const RechartsTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const RechartsResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';

type StatCardProps = {
    title: string;
    value: string;
    subtitle?: string;
    statusLabel?: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, statusLabel = 'Aktif' }) => (
    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col gap-1.5 min-h-[96px]">
        <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-medium text-gray-600 tracking-wide">{title}</h3>
            <span className="text-[11px] font-medium text-emerald-600">
                {statusLabel}
            </span>
        </div>
        <div className="mt-1">
            <p className="text-3xl font-semibold text-gray-900 leading-tight">{value}</p>
            {subtitle && (
                <p className="mt-0.5 text-[11px] text-gray-500">
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = React.useState<{
        orderCount: number;
        categoryCount: number;
        pendingOrders: number;
        scanCount: number;
        monthlyScans?: any[];
    }>({
        orderCount: 0,
        categoryCount: 0,
        pendingOrders: 0,
        scanCount: 0
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userRes = await fetch('/api/auth/me');
                if (!userRes.ok) {
                    window.location.href = '/login';
                    return;
                }
                const userData = await userRes.json();

                if (userData.user.role === 'SUPER_ADMIN') {
                    setStats({
                        orderCount: 0,
                        categoryCount: 0,
                        pendingOrders: 0,
                        scanCount: 0
                    });
                    setLoading(false);
                    return;
                }

                const tenantId = userData.user.tenantId;
                const statsRes = await fetch(`/api/restaurant/stats?tenantId=${tenantId}`);
                const statsData = await statsRes.json();

                if (statsData && typeof statsData.orderCount === 'number') {
                    setStats(statsData);
                }
            } catch (error) {
                console.error('Data fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const isSuperAdminView = !loading && stats.orderCount === 0 && stats.categoryCount === 0;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
            <Activity size={56} className="animate-spin text-[#ff7a21]" />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Veriler Analiz Ediliyor...</p>
        </div>
    );

    return (
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Page Header Area */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="max-w-3xl">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <MobileMenuToggle />
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                            Gösterge Paneli
                        </h2>
                    </div>
                    <p className="text-gray-500 mt-3 text-lg font-medium leading-relaxed">
                        Restoranınızın performansını, sipariş hacmini ve müşteri etkileşimlerini gerçek zamanlı izleyin.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-4 bg-gray-50 px-8 py-4 rounded-[28px] border-2 border-gray-100">
                        <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ea580c]">
                            <TrendingUp size={20} strokeWidth={3} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Durum</p>
                            <p className="text-sm font-black text-gray-900 leading-none">Canlı Takip Aktif</p>
                        </div>
                    </div>
                    <ProfileDropdown />
                </div>
            </header>

            {isSuperAdminView && (
                <div className="mb-12 p-8 bg-blue-50 border-2 border-blue-100 rounded-[32px] flex items-start gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                        <Activity size={24} strokeWidth={3} />
                    </div>
                    <div>
                        <h4 className="text-blue-900 font-black text-lg mb-1 tracking-tight">Süper Admin Görünümü</h4>
                        <p className="text-blue-700/70 font-medium leading-relaxed italic">
                            Şu anda bir restoran seçili değil. Restoran verilerini görmek için Yönetici Panelinden bir restoran seçerek "Yönet" diyebilirsiniz.
                        </p>
                    </div>
                </div>
            )}

            <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-12"
                style={{ color: 'rgba(15, 23, 42, 1)' }}
            >
                <StatCard
                    title="Bekleyen Siparişler"
                    value={stats.pendingOrders.toString()}
                    subtitle="Son 24 saat"
                />
                <StatCard
                    title="Toplam Siparişler"
                    value={stats.orderCount.toString()}
                    subtitle="Tüm zamanlar"
                />
                <StatCard
                    title="Menü Kategorileri"
                    value={stats.categoryCount.toString()}
                    subtitle="Aktif kategori sayısı"
                />
            </div>

            <div className="grid grid-cols-1 gap-12">
                <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-sm border-2 border-gray-50 flex flex-col min-h-[500px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b-2 border-gray-50 pb-10">
                        <div className="flex items-center gap-5">
                            <div className="bg-orange-50 text-[#ff7a21] p-4 rounded-2xl border-2 border-orange-100">
                                <TrendingUp size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Performans Analizi</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">Son 7 Günlük Trend</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-[#ff7a21]"></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Taramalar</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Siparişler</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative">
                        {stats.monthlyScans && stats.monthlyScans.length > 0 ? (
                            <div className="h-[400px] w-full">
                                <RechartsResponsiveContainer width="100%" height="100%">
                                    <RechartsLineChart data={stats.monthlyScans} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ff7a21" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#ff7a21" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <RechartsCartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                                        <RechartsXAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                            dy={20}
                                        />
                                        <RechartsYAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                            dx={-10}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                borderRadius: '24px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                padding: '20px',
                                                backgroundColor: '#ffffff'
                                            }}
                                            itemStyle={{ fontWeight: 900, fontSize: '13px', padding: '4px 0' }}
                                            labelStyle={{ color: '#94a3b8', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px' }}
                                        />
                                        <RechartsLine
                                            type="monotone"
                                            dataKey="scans"
                                            name="QR Taramaları"
                                            stroke="#ff7a21"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: '#ff7a21', strokeWidth: 4, stroke: '#fff' }}
                                            activeDot={{ r: 8, strokeWidth: 0 }}
                                        />
                                        <RechartsLine
                                            type="monotone"
                                            dataKey="orders"
                                            name="Siparişler"
                                            stroke="#10b981"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: '#10b981', strokeWidth: 4, stroke: '#fff' }}
                                            activeDot={{ r: 8, strokeWidth: 0 }}
                                        />
                                    </RechartsLineChart>
                                </RechartsResponsiveContainer>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 group">
                                <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 group-hover:scale-110 transition-transform duration-500 border-2 border-dashed border-gray-100">
                                    <BarChart2 size={40} strokeWidth={2.5} />
                                </div>
                                <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest italic">Henüz yeterli veri seti oluşmadı</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

