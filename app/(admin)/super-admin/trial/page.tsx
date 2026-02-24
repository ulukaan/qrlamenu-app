"use client";
import React, { useState, useEffect } from 'react';
import { Clock, Users, Zap, CheckCircle, AlertCircle, Search, Loader2, Calendar, Save, X, ArrowRightCircle, RefreshCcw } from 'lucide-react';

export default function TrialManagementPage() {
    const [trials, setTrials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [extendDays, setExtendDays] = useState('7');
    const [customDate, setCustomDate] = useState('');

    useEffect(() => {
        fetchTrials();
    }, []);

    const fetchTrials = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/trial');
            if (!res.ok) throw new Error('Trial verileri yüklenemedi');
            const data = await res.json();
            setTrials(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, updateData: any) => {
        try {
            setIsSaving(true);
            const res = await fetch('/api/admin/trial', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updateData })
            });

            if (res.ok) {
                setModalOpen(false);
                fetchTrials();
            } else {
                alert('Güncelleme sırasında hata oluştu.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExtend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTenant) return;

        let newDate: Date;
        if (extendDays === 'custom' && customDate) {
            newDate = new Date(customDate);
        } else {
            const currentExpire = new Date(selectedTenant.trialExpiresAt);
            newDate = new Date(currentExpire.getTime() + (parseInt(extendDays) * 24 * 60 * 60 * 1000));
        }

        handleUpdate(selectedTenant.id, { trialExpiresAt: newDate.toISOString() });
    };

    const calculateDaysLeft = (expiresAt: string) => {
        const diff = new Date(expiresAt).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const stats = {
        activeCount: trials.length,
        urgentCount: trials.filter(t => calculateDaysLeft(t.trialExpiresAt) <= 2).length,
        conversion: trials.length > 0 ? "12.4" : "0" // Simulated or placeholder
    };

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Trial (Deneme) Yönetimi</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Sistemdeki deneme sürecindeki işletmeleri, süre aşımlarını ve müşteri dönüşüm potansiyelini analiz edin.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="İşletme adı ara..."
                            style={{ padding: '14px 24px 14px 54px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '0.95rem', width: '300px', outline: 'none', background: '#fff', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                            className="focus:border-orange-500 transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchTrials}
                        style={{ padding: '14px', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}
                        className="hover:bg-slate-50"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
                <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Aktif Trial</p>
                            <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.05em', lineHeight: '1' }}>{loading ? '...' : stats.activeCount}</h3>
                            <p style={{ margin: '14px 0 0 0', color: '#10b981', fontSize: '0.9rem', fontWeight: '800' }}>Canlı Süreç</p>
                        </div>
                        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '20px', color: '#0ea5e9', border: '1px solid #e0f2fe' }}>
                            <Clock size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Kritik (48 Saat)</p>
                            <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', color: '#f43f5e', letterSpacing: '-0.05em', lineHeight: '1' }}>{loading ? '...' : stats.urgentCount}</h3>
                            <p style={{ margin: '14px 0 0 0', color: '#f43f5e', fontSize: '0.9rem', fontWeight: '800' }}>Acil Aksiyon Gerekli</p>
                        </div>
                        <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '20px', color: '#f43f5e', border: '1px solid #fee2e2' }}>
                            <AlertCircle size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '120px', height: '120px', background: 'rgba(52,211,153,0.1)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Tahmini Dönüşüm</p>
                                <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '1' }}>%{stats.conversion}</h3>
                                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '6px 14px', borderRadius: '10px', width: 'fit-content' }}>
                                    <Zap size={16} fill="currentColor" /> <span>Trend Yukarı</span>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Zap size={28} color="#10b981" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}>
                        <div style={{ padding: '28px 40px', borderBottom: '1px solid #f1f5f9', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Deneme Süreci İzleme Merkezi</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>İşletme Profili</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bitiş Tarihi</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Durum</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Yönetim</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '120px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#94a3b8' }}>
                                                    <Loader2 size={48} className="animate-spin text-orange-500" />
                                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Veritabanı Senkronize Ediliyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: '#f43f5e', fontWeight: '900' }}>{error}</td>
                                        </tr>
                                    ) : trials.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '120px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', color: '#cbd5e1' }}>
                                                    <Clock size={72} strokeWidth={1} />
                                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Şu an için herhangi bir trial kaydı bulunmuyor.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : trials.map((row, idx) => {
                                        const daysLeft = calculateDaysLeft(row.trialExpiresAt);
                                        return (
                                            <tr key={row.id} style={{ borderBottom: idx < trials.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'all 0.2s' }} className="hover:bg-slate-50 group">
                                                <td style={{ padding: '32px 40px' }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>{row.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700', marginTop: '6px' }}>Kurumsal ID: <span style={{ color: '#ff7a21' }}>#{row.id.substring(0, 8).toUpperCase()}</span></div>
                                                </td>
                                                <td style={{ padding: '32px 40px' }}>
                                                    <div style={{ fontSize: '1rem', color: '#374151', fontWeight: '800' }}>
                                                        {new Date(row.trialExpiresAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '900',
                                                        marginTop: '8px',
                                                        color: daysLeft <= 3 ? '#ef4444' : '#64748b'
                                                    }}>
                                                        {daysLeft} gün kaldı
                                                    </div>
                                                </td>
                                                <td style={{ padding: '32px 40px' }}>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        background: daysLeft <= 3 ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                        color: daysLeft <= 3 ? '#f43f5e' : '#10b981',
                                                        padding: '8px 18px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '900',
                                                        border: '1px solid currentColor',
                                                        letterSpacing: '0.02em'
                                                    }}>
                                                        {daysLeft <= 0 ? 'SÜRESİ DOLDU' : 'DENEME SÜRÜMÜ'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '32px 40px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTenant(row);
                                                                setModalOpen(true);
                                                            }}
                                                            style={{ padding: '10px 20px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                            className="hover:border-orange-500 hover:text-orange-500 transition-all"
                                                        >
                                                            <Calendar size={16} /> Süreyi Uzat
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdate(row.id, { status: 'ACTIVE' })}
                                                            style={{ padding: '10px 20px', borderRadius: '12px', background: '#10b981', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                            className="hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                                                        >
                                                            <ArrowRightCircle size={16} /> Aktifleştir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Trial Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,122,33,0.1)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                                <div style={{ background: 'rgba(52,211,153,0.1)', padding: '10px', borderRadius: '14px' }}>
                                    <Zap size={24} color="#10b981" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Dönüşüm Rehberi</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ display: 'flex', gap: '18px' }}>
                                    <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '10px', height: 'fit-content' }}>
                                        <CheckCircle size={20} style={{ color: '#10b981' }} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.7', fontWeight: '600' }}>
                                        Sürecin <span style={{ color: '#fff', fontWeight: '900' }}>7. gününde</span> atılan mesajlar dönüşümü %24 artırır.
                                    </p>
                                </div>

                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                                <div style={{ display: 'flex', gap: '18px' }}>
                                    <div style={{ background: 'rgba(255,122,33,0.1)', padding: '8px', borderRadius: '10px', height: 'fit-content' }}>
                                        <CheckCircle size={20} style={{ color: '#ff7a21' }} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.7', fontWeight: '600' }}>
                                        <span style={{ color: '#ff7a21', fontWeight: '900' }}>WELCOME30</span> kodu ile son gün dönüşümlerini tetikleyin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', borderRadius: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#fff7f2', padding: '12px', borderRadius: '16px', border: '1px solid #ffedd5' }}>
                                <AlertCircle size={26} color="#ff7a21" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Otomatik Kısıtlama</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.7', fontWeight: '500' }}>
                                    Süresi dolan restoranlar <span style={{ color: '#f43f5e', fontWeight: '900' }}>+7 gün</span> tolerans süresi sonunda otomatik askıya alınır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extend Trial Modal */}
            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div className="animate-in fade-in zoom-in duration-300 card" style={{ padding: '48px', borderRadius: '32px', width: '100%', maxWidth: '540px', position: 'relative', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.3)', border: 'none', background: '#fff' }}>
                        <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '32px', right: '32px', background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover:bg-rose-50 hover:text-rose-500 transition-all">
                            <X size={20} />
                        </button>

                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ width: '56px', height: '56px', background: '#fff7ed', color: '#ff7a21', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <Calendar size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.04em' }}>Süre Uzatımı</h3>
                            <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>{selectedTenant?.name} işletmesi için deneme süresini güncelleyin.</p>
                        </div>

                        <form onSubmit={handleExtend}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#374151', marginBottom: '12px' }}>Uzatma Aralığı</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { label: '+7 Gün', value: '7' },
                                            { label: '+15 Gün', value: '15' },
                                            { label: 'Özel', value: 'custom' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setExtendDays(opt.value)}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    border: '1px solid',
                                                    borderColor: extendDays === opt.value ? '#ff7a21' : '#e2e8f0',
                                                    background: extendDays === opt.value ? '#fff7ed' : '#fff',
                                                    color: extendDays === opt.value ? '#ff7a21' : '#64748b',
                                                    fontWeight: '800',
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {extendDays === 'custom' && (
                                    <div className="animate-in slide-in-from-top-2 duration-300">
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#374151', marginBottom: '12px' }}>Yeni Bitiş Tarihi</label>
                                        <input
                                            type="date"
                                            required
                                            value={customDate}
                                            onChange={(e) => setCustomDate(e.target.value)}
                                            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', outline: 'none', fontWeight: '800', fontSize: '1rem', color: '#111827' }}
                                        />
                                    </div>
                                )}

                                <div style={{ marginTop: '12px' }}>
                                    <button
                                        type="submit" disabled={isSaving}
                                        style={{ width: '100%', padding: '18px', borderRadius: '16px', background: '#ff7a21', color: '#fff', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 20px 25px -5px rgba(255, 122, 33, 0.3)', border: 'none', fontSize: '1.1rem' }}
                                        className="hover:scale-[1.02] active:scale-95 disabled:opacity-70 transition-all"
                                    >
                                        {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                        Değişiklikleri Kaydet
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
