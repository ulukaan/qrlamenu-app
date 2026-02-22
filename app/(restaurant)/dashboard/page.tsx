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

const StatCard = ({ title, value, icon, iconBg, iconColor }: any) => (
    <div className="stat-card">
        <div className="stat-info">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
        <div className="stat-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
            {icon}
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
                // 1. Get current user info
                const userRes = await fetch('/api/auth/me');
                if (!userRes.ok) {
                    // Redirect to login if not authenticated
                    window.location.href = '/login';
                    return;
                }
                const userData = await userRes.json();

                // Check if user is Super Admin
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

                // 2. Fetch stats for this tenant
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

    // Helper to check if we are in "Admin Mode" causing 0 data
    const isSuperAdminView = !loading && stats.orderCount === 0 && stats.categoryCount === 0;

    return (
        <div style={{ padding: '0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                background: 'transparent'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#333' }}>Gösterge Paneli</h1>
                <button className="back-btn">
                    Geri <ChevronRight size={14} /> Gösterge Paneli
                </button>
            </div>

            {isSuperAdminView && (
                <div style={{ margin: '0 2rem 1.5rem 2rem', padding: '1rem', background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px', color: '#1e40af', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#3b82f6', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>i</div>
                    <div>
                        <strong>Süper Admin Görünümü:</strong> Şu anda bir restoran seçili değil. Restoran verilerini görmek için Yönetici Panelinden bir restoran seçerek "Yönet" diyebilirsiniz.
                    </div>
                </div>
            )}

            <div className="grid-dashboard">
                <StatCard
                    title="Bekleyen Siparişler"
                    value={loading ? "..." : stats.pendingOrders.toString()}
                    icon={<Activity size={32} />}
                    iconBg="#fff1f2"
                    iconColor="#e11d48"
                />
                <StatCard
                    title="Toplam Siparişler"
                    value={loading ? "..." : stats.orderCount.toString()}
                    icon={<BarChart2 size={32} />}
                    iconBg="#f0fdf4"
                    iconColor="#16a34a"
                />
                <StatCard
                    title="Menü Kategorileri"
                    value={loading ? "..." : stats.categoryCount.toString()}
                    icon={<UtensilsCrossed size={32} />}
                    iconBg="#fffbeb"
                    iconColor="#d97706"
                />
            </div>

            <div style={{ padding: '0.5rem 2rem 2rem 2rem' }}>
                <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <TrendingUp size={18} style={{ color: '#ff7a21' }} />
                        <h2 style={{ fontSize: '1rem', fontWeight: '500', color: '#ff7a21' }}>Son 7 Günlük Analiz</h2>
                    </div>

                    <div style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        minHeight: '300px'
                    }}>
                        {!loading && stats.monthlyScans && stats.monthlyScans.length > 0 ? (
                            <RechartsResponsiveContainer width="100%" height={300}>
                                <RechartsLineChart data={stats.monthlyScans} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <RechartsCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <RechartsXAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                                    <RechartsYAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <RechartsLine type="monotone" dataKey="scans" name="QR Taramaları" stroke="#ff7a21" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    <RechartsLine type="monotone" dataKey="orders" name="Siparişler" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </RechartsLineChart>
                            </RechartsResponsiveContainer>
                        ) : (
                            <div style={{
                                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.9rem'
                            }}>
                                {loading ? 'Yükleniyor...' : 'Grafik Verisi Mevcut Değil'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
