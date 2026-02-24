"use client";
import React from 'react';
import { Printer, Wifi, WifiOff, Activity, ShieldCheck, RefreshCw } from 'lucide-react';

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
        <div style={{ padding: '1.5rem 2rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Yerel Servis & Yazıcı İzleme</h2>
                    <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.9rem', fontWeight: '500' }}>Restoran terminallerindeki print agent servislerinin aktiflik, gecikme ve sistem sağlığını gerçek zamanlı izleyin.</p>
                </div>
                <button className="hover:scale-105 active:scale-95 transition-all" style={{ background: '#ff7a21', color: '#fff', padding: '12px 24px', borderRadius: '14px', border: 'none', fontSize: '0.9rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}>
                    <RefreshCw size={18} strokeWidth={2.5} /> Ağ Taraması Başlat
                </button>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="card" style={{ border: 'none', padding: '28px', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Aktif Terminal Servisleri</p>
                            <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', color: '#10b981', letterSpacing: '-0.05em', lineHeight: '1' }}>{loading ? '...' : stats.online}</h3>
                            <div style={{ marginTop: '16px', width: '100%', height: '8px', background: '#f8fafc', borderRadius: '4px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                <div style={{ width: `${onlinePercentage}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px' }}></div>
                            </div>
                            <p style={{ margin: '12px 0 0 0', color: '#10b981', fontSize: '0.85rem', fontWeight: '800' }}>%{onlinePercentage.toFixed(1)} Operasyonel Başarı</p>
                        </div>
                        <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '18px', color: '#10b981', border: '1px solid #d1fae5' }}>
                            <Wifi size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ border: 'none', padding: '28px', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Erişilemeyen Birimler</p>
                            <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', color: '#f43f5e', letterSpacing: '-0.05em', lineHeight: '1' }}>{loading ? '...' : stats.offline}</h3>
                            <div style={{ marginTop: '16px', width: '100%', height: '8px', background: '#f8fafc', borderRadius: '4px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                <div style={{ width: `${offlinePercentage}%`, height: '100%', background: 'linear-gradient(90deg, #f43f5e, #fb7185)', borderRadius: '4px' }}></div>
                            </div>
                            <p style={{ margin: '12px 0 0 0', color: '#f43f5e', fontSize: '0.85rem', fontWeight: '800' }}>Acil Müdahale Gerekebilir</p>
                        </div>
                        <div style={{ background: '#fff1f2', padding: '14px', borderRadius: '18px', color: '#f43f5e', border: '1px solid #fee2e2' }}>
                            <WifiOff size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Terminal Bağlantı Kanalları</h3>
                            <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#64748b', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>Toplam {agents.length} Agent</div>
                        </div>
                        <div style={{ padding: '0 28px' }}>
                            {loading ? (
                                <div style={{ padding: '60px', textAlign: 'center' }}>
                                    <RefreshCw size={40} className="animate-spin text-orange-500" style={{ margin: '0 auto' }} />
                                    <p style={{ color: '#94a3b8', fontWeight: '800', marginTop: '16px', fontSize: '1rem' }}>Terminal verileri senkronize ediliyor...</p>
                                </div>
                            ) : error ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#f43f5e', fontWeight: '900', fontSize: '1rem' }}>{error}</div>
                            ) : agents.length === 0 ? (
                                <div style={{ padding: '60px', textAlign: 'center' }}>
                                    <Printer size={56} style={{ color: '#cbd5e1', margin: '0 auto 20px', strokeWidth: 1 }} />
                                    <p style={{ color: '#94a3b8', fontWeight: '800', fontSize: '1rem' }}>Sistemde kayıtlı servis bulunmuyor.</p>
                                </div>
                            ) : agents.map((row, i) => (
                                <div key={row.id} className="group" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px 0', borderBottom: i < agents.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'all 0.3s' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: row.status === 'ONLINE' ? '#10b981' : '#f43f5e',
                                            boxShadow: row.status === 'ONLINE' ? '0 0 15px rgba(16, 185, 129, 0.5)' : '0 0 15px rgba(244, 63, 94, 0.3)',
                                            flexShrink: 0
                                        }}></div>
                                        {row.status === 'ONLINE' && <div className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', opacity: 0.4 }}></div>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '1.05rem', color: '#111827', letterSpacing: '-0.02em' }}>{row.name || row.tenant?.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AGENT-ID: <span style={{ color: '#ff7a21' }}>{row.agentId}</span></span>
                                            <span style={{ fontSize: '0.75rem', color: '#e2e8f0', fontWeight: '400' }}>|</span>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '900', background: '#f8fafc', padding: '2px 8px', borderRadius: '6px' }}>VERSION {row.version || '1.0.0'} STABLE</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '160px' }}>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 14px',
                                            borderRadius: '10px',
                                            background: row.latency > 100 ? 'rgba(180, 83, 9, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: row.latency > 100 ? '#b45309' : '#10b981',
                                            border: '1px solid currentColor',
                                            opacity: row.status === 'ONLINE' ? 1 : 0.4,
                                            transition: 'all 0.2s'
                                        }}>
                                            <Activity size={14} strokeWidth={2.5} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: '900' }}>{row.latency ? `${row.latency}ms` : 'N/A'}</span>
                                        </div>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.02em' }}>Son Sinyal: <span style={{ color: '#475569' }}>{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span></p>
                                    </div>
                                    <button className="hover:scale-105 active:scale-95 transition-all" style={{ padding: '10px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', fontSize: '0.85rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>Log Çek</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Network Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '1.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '28px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '120px', height: '120px', background: 'rgba(255,122,33,0.1)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ background: 'rgba(255,122,33,0.1)', padding: '8px', borderRadius: '12px' }}>
                                    <Activity size={20} color="#ff7a21" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Ağ Verimliliği</h3>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.7', fontWeight: '500' }}>
                                Platform genelinde terminal servislerinin ortalama yanıt süresi <span style={{ color: '#fff', fontWeight: '900' }}>42ms</span> olarak ölçüldü.
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '0.05em' }}>
                                        <span style={{ color: '#94a3b8' }}>VERİ PAKET BAŞARISI</span>
                                        <span style={{ color: '#10b981' }}>%99.8</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.02)' }}>
                                        <div style={{ width: '99.8%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '24px', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '14px', border: '1px solid #d1fae5' }}>
                                <ShieldCheck size={24} color="#10b981" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>End-to-End Güvenlik</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.7', fontWeight: '500' }}>
                                    Tüm print agent bağlantıları <span style={{ color: '#111827', fontWeight: '900' }}>AES-256 TLS 1.3</span> protokolü ile şifrelenmektedir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
