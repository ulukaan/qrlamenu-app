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
            <div style={{ height: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={40} className="animate-spin text-gray-200" />
            </div>
        );
    }

    if (!data) {
        return <div className="p-10 text-center text-red-500">Veriler yüklenemedi.</div>;
    }

    const stats = [
        { title: 'Toplam Restoran', value: data.totalRestaurants, icon: <Store size={22} />, color: '#ff7a21', trend: '+12%' },
        { title: 'Aktif Premium', value: data.activePremium, icon: <CreditCard size={22} />, color: '#4caf50', trend: '+5%' },
        { title: 'Toplam Üye', value: data.totalUsers, icon: <Users size={22} />, color: '#2196f3', trend: '+24%' },
        { title: 'Aylık Gelir', value: `₺${data.monthlyRevenue.toLocaleString('tr-TR')}`, icon: <TrendingUp size={22} />, color: '#9c27b0', trend: '+18%' },
    ];

    return (
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '100%' }}>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em' }}>Sistem Kontrol Merkezi</h2>
                    <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '0.95rem', fontWeight: '500' }}>Platform veri akışı, büyüme performansı ve sistem sağlığı analitiği.</p>
                </div>
                <div style={{ display: 'flex', gap: '14px' }}>
                    <div style={{ position: 'relative' }}>
                        <Clock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <select style={{ padding: '12px 18px 12px 40px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.85rem', fontWeight: '800', color: '#374151', outline: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <option>Son 30 Günlük Veri</option>
                            <option>Son 7 Günlük Veri</option>
                            <option>Bugünün Özeti</option>
                        </select>
                    </div>
                    <button onClick={() => router.push('/super-admin/restoranlar/yeni')} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '900', boxShadow: '0 4px 12px rgba(255,122,33,0.2)' }}>
                        Yeni Restoran Kaydı
                    </button>
                </div>
            </div>

            {/* İstatistik Kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                {stats.map((stat, idx) => (
                    <div className="card" key={idx} style={{ border: 'none', padding: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', background: '#fff' }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: `${stat.color}08` }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                            <div>
                                <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{stat.title}</p>
                                <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.03em' }}>{stat.value}</h3>
                                <div style={{
                                    marginTop: '16px',
                                    fontSize: '0.8rem',
                                    color: stat.trend.startsWith('+') ? '#10b981' : '#f43f5e',
                                    fontWeight: '900',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', background: stat.trend.startsWith('+') ? '#ecfdf5' : '#fff1f2', padding: '2px 8px', borderRadius: '6px' }}>
                                        {stat.trend.startsWith('+') ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                                        <span style={{ marginLeft: '2px' }}>{stat.trend}</span>
                                    </div>
                                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>büyüme</span>
                                </div>
                            </div>
                            <div style={{
                                background: `${stat.color}15`,
                                color: stat.color,
                                width: '56px',
                                height: '56px',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `inset 0 0 10px ${stat.color}10`
                            }}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Orta Bölüm: Grafikler ve Sağ Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ background: '#fff7ed', padding: '10px', borderRadius: '12px' }}>
                                    <TrendingUp size={24} style={{ color: '#ff7a21' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Finansal Gelir Analizi</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Platform genelinde aylık brüt kazanç akışı.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff7a21', boxShadow: '0 0 8px rgba(255,122,33,0.5)' }}></div>
                                <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '800' }}>Canlı Senkronizasyon</span>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: '400px' }}>
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
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '28px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Activity size={22} color="#ff7a21" /> Son Sistem Aktiviteleri
                            </h3>
                            <button onClick={() => router.push('/super-admin/restoranlar')} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: '900', fontSize: '0.8rem', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-slate-50">Tümünü Yönet</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f9fafb' }}>
                                    <tr>
                                        <th style={{ padding: '18px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>İşletme Detayı</th>
                                        <th style={{ padding: '18px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Üyelik Paketi</th>
                                        <th style={{ padding: '18px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Durum</th>
                                        <th style={{ padding: '18px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kayıt Zamanı</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentRestaurants.map((res: any, idx: number) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }} className="table-row-hover">
                                            <td style={{ padding: '24px 32px' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: '900', color: '#111827' }}>{res.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>{res.city || 'İstanbul'} • Türkiye</div>
                                            </td>
                                            <td style={{ padding: '24px 32px' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '900', padding: '6px 14px', borderRadius: '10px', background: '#f1f5f9', display: 'inline-block', color: '#334155', border: '1px solid #e2e8f0' }}>{res.plan}</div>
                                            </td>
                                            <td style={{ padding: '24px 32px' }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '900',
                                                    color: res.status === 'Aktif' ? '#10b981' : '#64748b',
                                                    background: res.status === 'Aktif' ? '#ecfdf5' : '#f9fafb',
                                                    padding: '6px 14px',
                                                    borderRadius: '10px',
                                                    border: '1px solid currentColor'
                                                }}>{res.status.toUpperCase()}</span>
                                            </td>
                                            <td style={{ padding: '24px 32px', fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>
                                                {new Date(res.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Platform Sağlığı */}
                    <div className="card" style={{ border: 'none', padding: '36px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                            <Activity size={24} style={{ color: '#4ade80' }} />
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform Sağlığı</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '12px', fontWeight: '700' }}>
                                    <span style={{ color: '#94a3b8' }}>API Ortalama Yanıt</span>
                                    <span style={{ color: '#4ade80' }}>42ms</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '85%', height: '100%', background: '#4ade80', boxShadow: '0 0 10px rgba(74,222,128,0.3)' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '12px', fontWeight: '700' }}>
                                    <span style={{ color: '#94a3b8' }}>Kullanılan Kapasite</span>
                                    <span style={{ color: '#fbbf24' }}>%4.2</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '12%', height: '100%', background: '#fbbf24', boxShadow: '0 0 10px rgba(251,191,36,0.3)' }}></div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Database size={20} style={{ color: '#3b82f6' }} />
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '900', color: '#fff' }}>Cluster Durumu</p>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#4ade80', fontWeight: '800' }}>BAĞLI & OPTİMİZE</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                            <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '12px' }}>
                                <BarChart3 size={24} style={{ color: '#6366f1' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Büyüme Eğrisi</h3>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: '240px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.signupHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '0.8rem' }} />
                                    <Bar dataKey="value" fill="#1e293b" radius={[6, 6, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p style={{ marginTop: '24px', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', fontWeight: '600', fontStyle: 'italic' }}>Son 7 gündeki yeni işletme kayıtları.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
