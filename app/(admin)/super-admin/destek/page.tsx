"use client";
import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Search, Phone, User, Clock, Filter, Loader2, CheckCircle, XCircle, Globe, Smartphone } from 'lucide-react';

export default function SupportPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/crm');
                if (!res.ok) throw new Error('Mesajlar yüklenemedi');
                const data = await res.json();
                setLeads(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Destek & Talepler</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Kullanıcı geri bildirimlerini, teknik biletleri ve kurumsal talepleri tek merkezden yönetin.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Ad, e-posta veya mesaj..."
                            style={{ padding: '14px 24px 14px 54px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '0.95rem', width: '320px', outline: 'none', background: '#fff', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                            className="focus:border-orange-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Premium Categories Filter Bar */}
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {['Tüm Talepler', 'Yanıt Bekleyenler', 'Çözümlenenler', 'Arşivlenenler', 'Şikayet / İtiraz'].map((cat, i) => (
                            <button key={i} style={{
                                padding: '12px 24px',
                                borderRadius: '16px',
                                background: i === 0 ? '#1e293b' : '#fff',
                                color: i === 0 ? '#fff' : '#64748b',
                                fontWeight: '900',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                border: i === 0 ? 'none' : '1px solid #e2e8f0',
                                boxShadow: i === 0 ? '0 10px 15px -3px rgba(30, 41, 59, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                                transition: 'all 0.2s'
                            }} className="hover:scale-105 active:scale-95">{cat}</button>
                        ))}
                    </div>

                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}>
                        {loading ? (
                            <div style={{ padding: '120px', textAlign: 'center' }}>
                                <Loader2 size={48} className="animate-spin text-orange-500" style={{ margin: '0 auto' }} />
                                <p style={{ marginTop: '24px', fontWeight: '800', color: '#64748b', fontSize: '1.1rem' }}>Veriler Senkronize Ediliyor...</p>
                            </div>
                        ) : error ? (
                            <div style={{ padding: '80px', textAlign: 'center', color: '#f43f5e', fontWeight: '900', background: '#fff1f2' }}>{error}</div>
                        ) : leads.length === 0 ? (
                            <div style={{ padding: '120px', textAlign: 'center' }}>
                                <MessageSquare size={64} style={{ color: '#e2e8f0', margin: '0 auto 24px' }} strokeWidth={1.5} />
                                <h4 style={{ fontWeight: '900', color: '#111827', fontSize: '1.25rem' }}>İletişim Kutusu Boş</h4>
                                <p style={{ fontWeight: '600', color: '#94a3b8', marginTop: '8px' }}>Şu an için herhangi bir aktif destek talebi bulunmuyor.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {leads.map((msg, idx) => (
                                    <div key={msg.id} style={{
                                        padding: '40px',
                                        borderBottom: idx < leads.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        display: 'flex',
                                        gap: '32px',
                                        background: msg.status === 'PENDING' ? '#fff' : '#fcfcfc',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative'
                                    }} className="hover:bg-slate-50 group">
                                        {msg.status === 'PENDING' && (
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#ff7a21' }}></div>
                                        )}

                                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: msg.status === 'PENDING' ? 'linear-gradient(135deg, #ff7a21 0%, #ffb07a 100%)' : '#f1f5f9', color: msg.status === 'PENDING' ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: msg.status === 'PENDING' ? '0 10px 20px rgba(255, 122, 33, 0.25)' : 'none' }}>
                                            <MessageSquare size={28} strokeWidth={msg.status === 'PENDING' ? 2.5 : 2} />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>{msg.name}</h4>
                                                    <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b', fontWeight: '700' }}>
                                                            <Mail size={16} style={{ color: '#ff7a21' }} /> {msg.email}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b', fontWeight: '700' }}>
                                                            <Phone size={16} style={{ color: '#10b981' }} /> {msg.phone || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '800' }}>
                                                        <Clock size={14} /> {new Date(msg.createdAt).toLocaleString('tr-TR')}
                                                    </div>
                                                    <div style={{ marginTop: '12px' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '10px', background: msg.status === 'PENDING' ? 'rgba(16, 185, 129, 0.1)' : '#f8fafc', color: msg.status === 'PENDING' ? '#10b981' : '#64748b', border: '1px solid currentColor', letterSpacing: '0.05em' }}>
                                                            {msg.status === 'PENDING' ? 'YENİ TALEP' : 'İŞLENDİ'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ background: '#f8fafc', padding: '24px 32px', borderRadius: '20px', border: '1px solid #f1f5f9', marginBottom: '24px', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: '-10px', left: '20px', width: '20px', height: '20px', background: '#f8fafc', borderLeft: '1px solid #f1f5f9', borderTop: '1px solid #f1f5f9', transform: 'rotate(45deg)' }}></div>
                                                <p style={{ margin: 0, fontSize: '1rem', color: '#334155', lineHeight: '1.8', fontWeight: '500' }}>
                                                    {msg.notes || 'Herhangi bir detaylı açıklama metni tanımlanmamıştır.'}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                                <button style={{ padding: '12px 28px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.9rem', fontWeight: '900', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-slate-50 hover:border-slate-300">Arşive Kaldır</button>
                                                <button style={{ padding: '12px 32px', borderRadius: '14px', border: 'none', background: '#ff7a21', color: '#fff', fontSize: '0.9rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.25)', transition: 'all 0.2s' }} className="hover:scale-105 active:scale-95">Hemen Yanıtla</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '150px', height: '150px', background: 'rgba(59,130,246,0.1)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                                <div style={{ background: 'rgba(255,122,33,0.15)', padding: '10px', borderRadius: '14px' }}>
                                    <MessageSquare size={24} color="#ff7a21" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Bekleyen İş Yükü</h3>
                            </div>

                            <div style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '0.9', letterSpacing: '-0.05em', marginBottom: '12px' }}>{leads.filter(l => l.status === 'PENDING').length}</div>
                            <p style={{ margin: 0, fontSize: '1rem', color: '#94a3b8', fontWeight: '700' }}>Aktif Aksiyon Bekleyen Talep</p>

                            <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>Müşteri Memnuniyeti</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#10b981' }}>%98.4</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', borderRadius: '28px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '0.9rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hız Göstergesi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '800' }}>Yanıt Süresi</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#10b981' }}>14 dk</span>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '32px', borderRadius: '28px', background: '#fff', border: '1px solid #e2e8f0' }}>
                        <h5 style={{ margin: '0 0 24px 0', fontSize: '0.9rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trafik Kaynakları</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { label: 'Web Portalı', count: '82%', icon: <Globe size={16} />, color: '#3b82f6' },
                                { label: 'Mobile App', count: '12%', icon: <Smartphone size={16} />, color: '#8b5cf6' },
                                { label: 'E-Posta', count: '6%', icon: <Mail size={16} />, color: '#ff7a21' }
                            ].map((channel, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#1e293b', fontWeight: '800' }}>
                                        <div style={{ color: channel.color }}>{channel.icon}</div>
                                        {channel.label}
                                    </div>
                                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#111827' }}>{channel.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
