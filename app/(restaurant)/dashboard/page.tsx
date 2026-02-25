"use client";
import React from 'react';
import {
    Activity,
    BarChart2,
    UtensilsCrossed,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
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
import { StatCard } from '@/components/ui/stat-card';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { getPusherClient } from '@/lib/pusher-client';
import { formatTime, formatSmartDate } from '@/lib/date-utils';

interface Notification {
    id: string;
    type: 'ORDER' | 'WAITER_CALL' | 'SYSTEM' | 'TICKET';
    title: string;
    time: string | Date;
    status: string;
}

export default function Dashboard() {
    const [stats, setStats] = React.useState<{
        orderCount: number;
        categoryCount: number;
        pendingOrders: number;
        scanCount: number;
        monthlyScans?: any[];
        recentNotifications: Notification[];
        tenantId: string;
    }>({
        orderCount: 0,
        categoryCount: 0,
        pendingOrders: 0,
        scanCount: 0,
        recentNotifications: [] as Notification[],
        tenantId: ''
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
                    setStats(prev => ({ ...prev, tenantId: '' }));
                    setLoading(false);
                    return;
                }

                const tenantId = userData.user.tenantId;
                // Parallelize stats fetch with potential other init calls
                const [statsRes] = await Promise.all([
                    fetch(`/api/restaurant/stats?tenantId=${tenantId}`)
                ]);

                const statsData = await statsRes.json();

                if (statsData && typeof statsData.orderCount === 'number') {
                    setStats({
                        ...statsData,
                        tenantId: tenantId
                    });
                }
            } catch (error) {
                console.error('Data fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Pusher Real-time Integration
    React.useEffect(() => {
        const pusher = getPusherClient();
        if (!pusher || !stats.tenantId) return;

        const channel = pusher.subscribe(`restaurant-${stats.tenantId}`);

        const handleNewNotification = (data: any, type: Notification['type']) => {
            setStats(prev => {
                let title = '';
                if (type === 'ORDER') title = `Masa ${data.tableId || 'P'}: Yeni Sipariş`;
                else if (type === 'WAITER_CALL') title = `Masa ${data.tableId}: Garson Çağrısı`;
                else if (type === 'TICKET') title = `Yeni Destek Mesajı`;

                const newNotification: Notification = {
                    id: data.id || (data.message && data.message.id) || Math.random().toString(),
                    type: type,
                    title: title,
                    time: new Date(),
                    status: 'PENDING'
                };

                // Add to list and keep only last 5
                const updatedList = [newNotification, ...prev.recentNotifications]
                    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Deduplicate
                    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                    .slice(0, 5);

                return {
                    ...prev,
                    recentNotifications: updatedList,
                    pendingOrders: type === 'ORDER' ? prev.pendingOrders + 1 : prev.pendingOrders
                };
            });
        };

        channel.bind('new-order', (data: any) => handleNewNotification(data, 'ORDER'));
        channel.bind('new-waiter-call', (data: any) => handleNewNotification(data, 'WAITER_CALL'));
        channel.bind('new-message', (data: any) => handleNewNotification(data, 'TICKET'));
        channel.bind('update-order-count', fetchData); // Fetch fresh stats on count update

        return () => {
            pusher.unsubscribe(`restaurant-${stats.tenantId}`);
        };
    }, [stats.tenantId]);

    const fetchData = async () => {
        if (!stats.tenantId) return;
        try {
            const res = await fetch(`/api/restaurant/stats?tenantId=${stats.tenantId}`);
            const data = await res.json();
            if (data && typeof data.orderCount === 'number') {
                setStats(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Refresh error:', error);
        }
    };

    const isSuperAdminView = !loading && stats.orderCount === 0 && stats.categoryCount === 0;

    if (loading) return <LoadingScreen message="GÖSTERGE PANELİ YÜKLENİYOR" />;

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
                    <p className="text-[13px] font-medium text-slate-500">Restoranınızın bugünkü performansına hızlıca göz atın.</p>
                </div>
                <div className="hidden lg:flex items-center gap-4">
                    <div className="hidden lg:flex bg-white h-9 px-4 rounded-[6px] border border-slate-200 items-center gap-3 shadow-sm transition-all hover:border-slate-300">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-[12px] font-bold text-slate-900 leading-none">Canlı Takip Aktif</p>
                    </div>
                    <ProfileDropdown />
                </div>
            </header>

            <div className="h-px bg-slate-200/60 w-full mb-10" />

            {isSuperAdminView && (
                <div className="mb-10 p-6 bg-blue-50/50 border border-blue-100 rounded-[6px] flex items-start gap-5">
                    <div className="bg-slate-900 text-white w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10">
                        <Activity size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className="text-slate-900 font-bold text-[14px] uppercase tracking-tight">Süper Admin Görünümü</h4>
                        <p className="text-slate-500 font-medium text-[12px] mt-1">
                            Şu anda bir restoran seçili değil. Restoran verileri için bir restoran seçerek "Yönet" diyebilirsiniz.
                        </p>
                    </div>
                </div>
            )}

            <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
            >
                <StatCard
                    title="BEKLEYEN SİPARİŞLER"
                    value={stats.pendingOrders.toString()}
                    subtitle="Hemen aksiyon bekliyor"
                    statusLabel="KRİTİK"
                />
                <StatCard
                    title="TOPLAM SİPARİŞLER"
                    value={stats.orderCount.toString()}
                    subtitle="Bu ayki performans"
                />
                <StatCard
                    title="AKTİF KATEGORİLER"
                    value={stats.categoryCount.toString()}
                    subtitle="Menü çeşitliliği"
                />
                <StatCard
                    title="QR TARAMALARI"
                    value={stats.scanCount.toString()}
                    subtitle="Müşteri etkileşimi"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 py-4 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-[4px] flex items-center justify-center border border-orange-100/50">
                                    <TrendingUp size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Performans Analizi</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Son 7 Günlük Trafik</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 flex-1 w-full relative">
                            {stats.monthlyScans && stats.monthlyScans.length > 0 ? (
                                <div className="h-[300px] w-full">
                                    <RechartsResponsiveContainer width="100%" height="100%">
                                        <RechartsLineChart data={stats.monthlyScans} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <RechartsCartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                                            <RechartsXAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                                            <RechartsYAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dx={-5} />
                                            <RechartsTooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', padding: '12px' }} />
                                            <RechartsLine type="monotone" dataKey="scans" name="Taramalar" stroke="#ff7a21" strokeWidth={3} dot={{ r: 3, fill: '#ff7a21', strokeWidth: 2, stroke: '#fff' }} />
                                            <RechartsLine type="monotone" dataKey="orders" name="Siparişler" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                                        </RechartsLineChart>
                                    </RechartsResponsiveContainer>
                                </div>
                            ) : (
                                <div className="inset-0 flex flex-col items-center justify-center gap-4 py-16">
                                    <BarChart2 size={32} className="text-slate-200" />
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Henüz veri seti yok</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="px-4 py-4 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Hızlı Özet</h3>
                            <button className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest">Tüm Raporu Gör</button>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sipariş</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gelir</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <tr className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-4 py-3 text-[12px] font-bold text-slate-800">Ana Yemekler</td>
                                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-500">24 Adet</td>
                                        <td className="px-4 py-3 text-[12px] font-bold text-slate-900">4,850 ₺</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-4 py-3 text-[12px] font-bold text-slate-800">İçecekler</td>
                                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-500">42 Adet</td>
                                        <td className="px-4 py-3 text-[12px] font-bold text-slate-900">1,240 ₺</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {/* Actions Widget */}
                    <div className="bg-slate-900 rounded-[6px] shadow-lg p-6 text-white">
                        <h3 className="text-[14px] font-bold uppercase tracking-tight mb-4">Hızlı İşlemler</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <Link href="/menu-ekle" className="flex items-center justify-between h-10 px-4 bg-white/10 hover:bg-white/15 rounded-[6px] transition-all group">
                                <span className="text-[12px] font-bold tracking-tight">Menü Düzenle</span>
                                <ChevronRight size={14} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/qr-olusturucu" className="flex items-center justify-between h-10 px-4 bg-white/10 hover:bg-white/15 rounded-[6px] transition-all group">
                                <span className="text-[12px] font-bold tracking-tight">QR Üret</span>
                                <ChevronRight size={14} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/kampanyalar" className="flex items-center justify-between h-10 px-4 bg-white/10 hover:bg-white/15 rounded-[6px] transition-all group">
                                <span className="text-[12px] font-bold tracking-tight">Yeni Kampanya</span>
                                <ChevronRight size={14} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200/60 p-6 min-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Bildirimler</h3>
                            <span className="w-5 h-5 bg-orange-100 text-orange-600 text-[10px] font-bold flex items-center justify-center rounded-full">
                                {stats.recentNotifications.length}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {stats.recentNotifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Henüz bildirim yok</p>
                                </div>
                            ) : (
                                stats.recentNotifications.map((noti) => (
                                    <div key={noti.id} className="flex gap-3 group animate-in slide-in-from-right-4 duration-300">
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${noti.type === 'ORDER' ? 'bg-orange-500' :
                                            noti.type === 'WAITER_CALL' ? 'bg-rose-500' :
                                                'bg-emerald-500'
                                            }`} />
                                        <div className="flex-1">
                                            <p className="text-[12px] font-bold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">
                                                {noti.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                                                {formatSmartDate(noti.time)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

