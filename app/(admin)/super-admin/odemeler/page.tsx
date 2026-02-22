"use client";
import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Download, TrendingUp, DollarSign, Calendar, ArrowUpRight, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/payments');
                if (!res.ok) throw new Error('Ödemeler yüklenemedi');
                const data = await res.json();
                setPayments(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const monthlyRevenue = totalRevenue / 12; // Simplified for demo stats

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Finansal Takip & İşlemler</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Platform genelindeki abonelik tahsilatlarını, MRR oranlarını ve fatura geçmişini izleyin.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button style={{ padding: '14px 28px', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0', color: '#374151', fontSize: '0.95rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} className="hover:bg-slate-50 hover:border-slate-300">
                        <Download size={20} /> Veri İndir (.csv)
                    </button>
                    <button className="hover:scale-105 active:scale-95 transition-all" style={{ background: '#ff7a21', color: '#fff', padding: '14px 32px', borderRadius: '16px', border: 'none', fontSize: '0.95rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}>
                        <DollarSign size={20} strokeWidth={3} /> Manuel Veri Ekle
                    </button>
                </div>
            </div>

            {/* High-End Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '3.5rem' }}>
                <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '120px', height: '120px', background: 'rgba(255,122,33,0.1)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Toplam İşlem Hacmi</p>
                                <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '1' }}>₺{totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}</h3>
                                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: '10px', width: 'fit-content' }}>
                                    <TrendingUp size={16} /> <span>Yıllık +12.5% artış</span>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <TrendingUp size={28} color="#ff7a21" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Aylık Tahsilat (MRR)</p>
                            <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.05em', lineHeight: '1' }}>₺{monthlyRevenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</h3>
                            <p style={{ margin: '12px 0 0 0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}>İşlem başı ort. <span style={{ color: '#111827' }}>₺{(totalRevenue / (payments.length || 1)).toFixed(0)}</span></p>
                        </div>
                        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '20px', color: '#0ea5e9', border: '1px solid #e0f2fe' }}>
                            <ArrowUpRight size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Hata / İade Oranı</p>
                            <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.05em', lineHeight: '1' }}>%1.6</h3>
                            <p style={{ margin: '12px 0 0 0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}><span style={{ color: '#10b981' }}>{Math.ceil(payments.length * 0.8)}</span> aktif abone</p>
                        </div>
                        <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '20px', color: '#10b981', border: '1px solid #d1fae5' }}>
                            <CheckCircle2 size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}>
                        <div style={{ padding: '28px 40px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Son Finansal Hareketler</h3>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="İşlem veya işletme ara..."
                                    style={{ padding: '12px 20px 12px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '280px', outline: 'none', fontWeight: '600', background: '#f8fafc' }}
                                    className="focus:border-orange-500 transition-all"
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>İşlem / Tarih</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>İşletme Kimliği</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Referans / Kanal</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Net Tutar</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '120px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#94a3b8' }}>
                                                    <Loader2 size={48} className="animate-spin text-orange-500" />
                                                    <span style={{ fontSize: '1rem', fontWeight: '800' }}>Finansal Veritabanı Senkronize Ediliyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#f43f5e', fontWeight: '900', background: '#fff1f2' }}>{error}</td>
                                        </tr>
                                    ) : payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '120px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', color: '#cbd5e1' }}>
                                                    <CreditCard size={72} strokeWidth={1.2} />
                                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Henüz kayıtlı bir ödeme bulunmamaktadır.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : payments.map((p, idx) => (
                                        <tr key={p.id} style={{ borderBottom: idx < payments.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'all 0.2s' }} className="hover:bg-slate-50 group">
                                            <td style={{ padding: '32px 40px' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#111827', letterSpacing: '0.05em' }}>#{p.id.substring(0, 8).toUpperCase()}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '800', marginTop: '6px' }}>
                                                    <Calendar size={14} style={{ color: '#ff7a21' }} /> {new Date(p.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td style={{ padding: '32px 40px' }}>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>{p.tenant?.name || 'BELİRSİZ KURULUŞ'}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', marginTop: '4px' }}>Müşteri ID: {p.tenantId?.substring(0, 8).toUpperCase()}</div>
                                            </td>
                                            <td style={{ padding: '32px 40px' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#374151' }}>{p.title}</div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: p.paymentMethod === 'CREDIT_CARD' ? '#3b82f6' : '#8b5cf6',
                                                    fontWeight: '900',
                                                    marginTop: '8px',
                                                    background: p.paymentMethod === 'CREDIT_CARD' ? '#eff6ff' : '#f5f3ff',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    width: 'fit-content'
                                                }}>{p.paymentMethod}</div>
                                            </td>
                                            <td style={{ padding: '32px 40px' }}>
                                                <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em' }}>₺{p.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                                            </td>
                                            <td style={{ padding: '32px 40px', textAlign: 'right' }}>
                                                <div style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '900',
                                                    padding: '8px 18px',
                                                    borderRadius: '12px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    background: p.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : p.status === 'PENDING' ? 'rgba(255, 122, 33, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                    color: p.status === 'COMPLETED' ? '#10b981' : p.status === 'PENDING' ? '#ff7a21' : '#f43f5e',
                                                    border: '1px solid currentColor'
                                                }}>
                                                    {p.status === 'COMPLETED' ? <CheckCircle2 size={14} strokeWidth={3} /> : p.status === 'PENDING' ? <Clock size={14} strokeWidth={3} /> : <AlertCircle size={14} strokeWidth={3} />}
                                                    {p.status === 'COMPLETED' ? 'ONAYLANDI' : p.status === 'PENDING' ? 'BEKLEMEDE' : 'BAŞARISIZ'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Financial Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '120px', height: '120px', background: 'rgba(99,102,241,0.1)', filter: 'blur(50px)', borderRadius: '50%' }}></div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                                <div style={{ background: 'rgba(255,122,33,0.15)', padding: '10px', borderRadius: '14px' }}>
                                    <TrendingUp size={24} color="#ff7a21" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Dağılım Analizi</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '1rem', fontWeight: '900' }}>
                                        <span style={{ color: '#94a3b8' }}>Online Tahsilat</span>
                                        <span style={{ color: '#fff' }}>%74.2</span>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: '74%', background: 'linear-gradient(90deg, #ff7a21, #ffb07a)', borderRadius: '5px' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '1rem', fontWeight: '900' }}>
                                        <span style={{ color: '#94a3b8' }}>Banka / EFT</span>
                                        <span style={{ color: '#fff' }}>%25.8</span>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: '26%', background: 'linear-gradient(90deg, #6366f1, #a5b4fc)', borderRadius: '5px' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ff7a21' }}>
                                    <AlertCircle size={20} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '900' }}>Önemli Not</span>
                                </div>
                                <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', fontWeight: '600' }}>
                                    Iyzico Bridge mutabakatları her gün saat 00:00'da otomatik olarak gerçekleşir.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', borderRadius: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                                <AlertCircle size={26} color="#f43f5e" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>İade Prosedürü</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.7', fontWeight: '500' }}>
                                    Online tahsilat iadeleri doğrudan <span style={{ color: '#ff7a21', fontWeight: '800' }}>Panel</span> üzerinden tetiklenmelidir. Havale iadeleri manuel onay gerektirir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
