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

    const updateLeadStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/crm', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                // Refresh list
                const refreshed = await fetch('/api/admin/crm').then(r => r.json());
                setLeads(refreshed);
            }
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

    return (
        <div style={{ padding: '1.5rem 2rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Destek & Talepler</h2>
                    <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.9rem', fontWeight: '500' }}>Kullanıcı geri bildirimlerini, teknik biletleri ve kurumsal talepleri tek merkezden yönetin.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Ad, e-posta veya mesaj..."
                            style={{ padding: '12px 20px 12px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '280px', outline: 'none', background: '#fff', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                            className="focus:border-orange-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Premium Categories Filter Bar */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {['Tüm Talepler'].map((cat, i) => (
                            <button key={i} style={{
                                padding: '10px 20px',
                                borderRadius: '14px',
                                background: i === 0 ? '#1e293b' : '#fff',
                                color: i === 0 ? '#fff' : '#64748b',
                                fontWeight: '900',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                border: i === 0 ? 'none' : '1px solid #e2e8f0',
                                boxShadow: i === 0 ? '0 10px 15px -3px rgba(30, 41, 59, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                                transition: 'all 0.2s'
                            }} className="hover:scale-105 active:scale-95">{cat}</button>
                        ))}
                    </div>

                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}>
                        {loading ? (
                            <div style={{ padding: '60px', textAlign: 'center' }}>
                                <Loader2 size={40} className="animate-spin text-orange-500" style={{ margin: '0 auto' }} />
                                <p style={{ marginTop: '16px', fontWeight: '800', color: '#64748b', fontSize: '1rem' }}>Veriler Senkronize Ediliyor...</p>
                            </div>
                        ) : error ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#f43f5e', fontWeight: '900', background: '#fff1f2' }}>{error}</div>
                        ) : leads.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center' }}>
                                <MessageSquare size={48} style={{ color: '#e2e8f0', margin: '0 auto 16px' }} strokeWidth={1.5} />
                                <h4 style={{ fontWeight: '900', color: '#111827', fontSize: '1.1rem' }}>İletişim Kutusu Boş</h4>
                                <p style={{ fontWeight: '600', color: '#94a3b8', marginTop: '8px', fontSize: '0.9rem' }}>Şu an için herhangi bir aktif destek talebi bulunmuyor.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {leads.map((msg, idx) => (
                                    <div key={msg.id} style={{
                                        padding: '24px',
                                        borderBottom: idx < leads.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        display: 'flex',
                                        gap: '24px',
                                        background: msg.status === 'PENDING' ? '#fff' : '#fcfcfc',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative'
                                    }} className="hover:bg-slate-50 group">
                                        {msg.status === 'PENDING' && (
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#ff7a21' }}></div>
                                        )}

                                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: msg.status === 'PENDING' ? 'linear-gradient(135deg, #ff7a21 0%, #ffb07a 100%)' : '#f1f5f9', color: msg.status === 'PENDING' ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: msg.status === 'PENDING' ? '0 10px 20px rgba(255, 122, 33, 0.25)' : 'none' }}>
                                            <MessageSquare size={24} strokeWidth={msg.status === 'PENDING' ? 2.5 : 2} />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>{msg.name}</h4>
                                                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>
                                                            <Mail size={14} style={{ color: '#ff7a21' }} /> {msg.email}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>
                                                            <Phone size={14} style={{ color: '#10b981' }} /> {msg.phone || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800' }}>
                                                        <Clock size={12} /> {new Date(msg.createdAt).toLocaleString('tr-TR')}
                                                    </div>
                                                    <div style={{ marginTop: '8px' }}>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '8px', background: msg.status === 'PENDING' ? 'rgba(16, 185, 129, 0.1)' : '#f8fafc', color: msg.status === 'PENDING' ? '#10b981' : '#64748b', border: '1px solid currentColor', letterSpacing: '0.05em' }}>
                                                            {msg.status === 'PENDING' ? 'YENİ TALEP' : (msg.status === 'LOST' ? 'ARŞİVLENDİ' : 'ÇÖZÜLDÜ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ background: '#f8fafc', padding: '16px 24px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '20px', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: '-8px', left: '16px', width: '16px', height: '16px', background: '#f8fafc', borderLeft: '1px solid #f1f5f9', borderTop: '1px solid #f1f5f9', transform: 'rotate(45deg)' }}></div>
                                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: '1.7', fontWeight: '500' }}>
                                                    {msg.notes || 'Herhangi bir detaylı açıklama metni tanımlanmamıştır.'}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                                {msg.status !== 'LOST' && (
                                                    <button onClick={() => updateLeadStatus(msg.id, 'LOST')} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-slate-50 hover:border-slate-300">Arşive Kaldır</button>
                                                )}
                                                {msg.status === 'PENDING' && (
                                                    <button onClick={() => updateLeadStatus(msg.id, 'CONTACTED')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: '#ff7a21', color: '#fff', fontSize: '0.85rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.25)', transition: 'all 0.2s' }} className="hover:scale-105 active:scale-95">Çözüldü İşaretle</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '1.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '28px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '120px', height: '120px', background: 'rgba(59,130,246,0.1)', filter: 'blur(40px)', borderRadius: '50%' }}></div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ background: 'rgba(255,122,33,0.15)', padding: '8px', borderRadius: '12px' }}>
                                    <MessageSquare size={20} color="#ff7a21" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Bekleyen İş Yükü</h3>
                            </div>

                            <div style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: '0.9', letterSpacing: '-0.05em', marginBottom: '8px' }}>{leads.filter(l => l.status === 'PENDING').length}</div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: '700' }}>Aktif Aksiyon Bekleyen Talep</p>

                            <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8' }}>Müşteri Memnuniyeti</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#10b981' }}>%98.4</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '24px', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '0.8rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hız Göstergesi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '800' }}>Yanıt Süresi</span>
                                <span style={{ fontSize: '1rem', fontWeight: '900', color: '#10b981' }}>14 dk</span>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', borderRadius: '24px', background: '#fff', border: '1px solid #e2e8f0' }}>
                        <h5 style={{ margin: '0 0 16px 0', fontSize: '0.8rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trafik Kaynakları</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Web Portalı', count: '82%', icon: <Globe size={14} />, color: '#3b82f6' },
                                { label: 'Mobile App', count: '12%', icon: <Smartphone size={14} />, color: '#8b5cf6' },
                                { label: 'E-Posta', count: '6%', icon: <Mail size={14} />, color: '#ff7a21' }
                            ].map((channel, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#1e293b', fontWeight: '800' }}>
                                        <div style={{ color: channel.color }}>{channel.icon}</div>
                                        {channel.label}
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#111827' }}>{channel.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
