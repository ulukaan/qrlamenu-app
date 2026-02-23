"use client";
import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, MessageSquare, Plus, Loader2, TrendingUp, CheckCircle2, X, Check, AlertCircle, MoreVertical, Trash2, Filter } from 'lucide-react';

export default function CRMPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('ALL');

    // Modal & Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        restaurant: '',
        email: '',
        phone: '',
        notes: ''
    });

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/crm');
            if (!res.ok) throw new Error('CRM verileri yüklenemedi');
            const data = await res.json();
            setLeads(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleAddLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/crm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                await fetchLeads();
                setIsAddModalOpen(false);
                setFormData({ name: '', restaurant: '', email: '', phone: '', notes: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/crm', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) fetchLeads();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm('Bu potansiyel müşteriyi silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/admin/crm?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchLeads();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredLeads = leads.filter(l => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PENDING') return l.status === 'PENDING';
        if (activeFilter === 'CONVERTED') return l.status === 'CONVERTED';
        if (activeFilter === 'LOST') return l.status === 'LOST';
        return true;
    });

    const stats = {
        total: leads.length,
        pending: leads.filter(l => l.status === 'PENDING').length,
        converted: leads.filter(l => l.status === 'CONVERTED').length,
        conversionRate: leads.length > 0
            ? ((leads.filter(l => l.status === 'CONVERTED').length / leads.length) * 100).toFixed(1)
            : '0'
    };

    return (
        <div style={{ padding: '1.5rem 2rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>CRM & Müşteri İlişkileri</h2>
                    <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.9rem', fontWeight: '500' }}>Potansiyel müşteri akışını yönetin ve satışlarınızı takip edin.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="hover:scale-105 active:scale-95 transition-all"
                        style={{ background: '#ff7a21', color: '#fff', padding: '12px 24px', borderRadius: '14px', border: 'none', fontSize: '0.9rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}
                    >
                        <Plus size={18} strokeWidth={3} /> Yeni Lead Tanımla
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Toplam Aday', value: stats.total, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
                    { label: 'Bekleyenler', value: stats.pending, icon: Calendar, color: '#ff7a21', bg: '#fff7ed' },
                    { label: 'Dönüşüm Oranı', value: `%${stats.conversionRate}`, icon: TrendingUp, color: '#10b981', bg: '#f0fdf4' },
                    { label: 'Dönüşenler', value: stats.converted, icon: CheckCircle2, color: '#6366f1', bg: '#f5f3ff' }
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ border: 'none', padding: '24px', background: '#fff', boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.04)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 6px 0', fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</p>
                            <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em' }}>{loading ? '...' : stat.value}</h3>
                        </div>
                        <div style={{ background: stat.bg, padding: '12px', borderRadius: '14px', color: stat.color, boxShadow: `inset 0 2px 4px rgba(0,0,0,0.02)` }}>
                            <stat.icon size={24} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '24px', background: '#fff' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Lead Akışı & Potansiyeller</h3>
                                <div style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', border: '1px solid #e2e8f0' }}>{filteredLeads.length} KAYIT</div>
                            </div>
                        </div>
                        <div style={{ padding: '28px', background: '#fff' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '60px' }}>
                                    <Loader2 className="animate-spin text-orange-500" size={40} style={{ margin: '0 auto' }} />
                                    <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '800', fontSize: '1rem' }}>Sistem Verilerine Erişiliyor...</p>
                                </div>
                            ) : error ? (
                                <div style={{ color: '#f43f5e', textAlign: 'center', padding: '40px', fontWeight: '900', background: '#fff1f2', borderRadius: '16px' }}>{error}</div>
                            ) : filteredLeads.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                        <Users size={32} style={{ color: '#cbd5e1' }} />
                                    </div>
                                    <h4 style={{ color: '#111827', fontWeight: '900', fontSize: '1.1rem', marginBottom: '8px' }}>Eşleşen Lead Bulunamadı</h4>
                                    <p style={{ color: '#64748b', fontWeight: '500', maxWidth: '300px', lineHeight: '1.5', fontSize: '0.9rem' }}>Seçili filtreye uygun kayıtlı potansiyel müşteri bulunmamaktadır.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {filteredLeads.map((lead) => (
                                        <div key={lead.id} className="lead-item group" style={{ display: 'flex', gap: '24px', padding: '24px', borderRadius: '20px', background: '#fff', border: '1px solid #f1f5f9', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' }}>
                                            <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: 'linear-gradient(90deg, #f8fafc 0%, transparent 100%)', opacity: 0, transition: '0.3s' }} className="group-hover:opacity-100"></div>

                                            <div style={{ width: '56px', height: '56px', background: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', flexShrink: 0, position: 'relative' }}>
                                                <Users size={24} strokeWidth={1.5} />
                                            </div>

                                            <div style={{ flex: 1, position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>
                                                            {lead.name} {lead.restaurant && <span style={{ color: '#94a3b8', fontWeight: '700', fontSize: '0.85rem' }}>• {lead.restaurant}</span>}
                                                        </h4>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                            <Calendar size={12} style={{ color: '#ff7a21' }} />
                                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KAYIT: {new Date(lead.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <select
                                                            value={lead.status}
                                                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                fontWeight: '900',
                                                                padding: '6px 10px',
                                                                borderRadius: '10px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em',
                                                                background: lead.status === 'CONVERTED' ? 'rgba(16, 185, 129, 0.1)' : lead.status === 'PENDING' ? 'rgba(255, 122, 33, 0.1)' : '#f1f5f9',
                                                                color: lead.status === 'CONVERTED' ? '#10b981' : lead.status === 'PENDING' ? '#ff7a21' : '#64748b',
                                                                border: '1px solid currentColor',
                                                                outline: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <option value="PENDING">BEKLEMEDE</option>
                                                            <option value="CONTACTED">GÖRÜŞÜLDÜ</option>
                                                            <option value="CONVERTED">DÖNÜŞTÜ</option>
                                                            <option value="LOST">KAYBEDİLDİ</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDeleteLead(lead.id)}
                                                            style={{ width: '32px', height: '32px', borderRadius: '10px', border: '1px solid #fee2e2', background: '#fff', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            className="hover:bg-rose-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6', fontWeight: '500', maxWidth: '600px' }}>{lead.notes || 'Herhangi bir görüşme notu eklenmemiş.'}</p>
                                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                    {lead.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}><div style={{ background: '#fff7ed', padding: '6px', borderRadius: '8px' }}><Mail size={14} color="#ff7a21" /></div> {lead.email}</div>}
                                                    {lead.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}><div style={{ background: '#ecfdf5', padding: '6px', borderRadius: '8px' }}><Phone size={14} color="#10b981" /></div> {lead.phone}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '1.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '28px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120px', height: '120px', background: 'rgba(255,122,33,0.1)', filter: 'blur(40px)', borderRadius: '50%' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', position: 'relative' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff7a21', boxShadow: '0 0 10px #ff7a21' }}></div>
                            <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Dönüşüm Kanalları</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
                            {[
                                { id: 'ALL', label: 'Bütün Potansiyeller' },
                                { id: 'PENDING', label: 'Bekleyen Adaylar' },
                                { id: 'CONVERTED', label: 'Dönüşen İşletmeler' },
                                { id: 'LOST', label: 'Arşivlenmiş Görüşmeler' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '14px',
                                        border: activeFilter === filter.id ? '1px solid rgba(255,122,33,0.3)' : '1px solid rgba(255,255,255,0.05)',
                                        background: activeFilter === filter.id ? 'rgba(255,122,33,0.1)' : 'rgba(255,255,255,0.03)',
                                        color: activeFilter === filter.id ? '#fff' : '#94a3b8',
                                        fontSize: '0.9rem',
                                        fontWeight: '800',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    className="hover:bg-slate-800"
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '24px', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '14px' }}>
                                <TrendingUp size={20} color="#10b981" />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: '900', color: '#111827' }}>Performans İpucu</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: '1.6', fontWeight: '500' }}>
                                    Potansiyel müşterilere <b style={{ color: '#10b981' }}>ilk 24 saat</b> içinde dönüş yapmak satış şansını %65 artırır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '32px', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.2)' }}>
                        <div style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>Yeni Lead Tanımla</h3>
                                <button onClick={() => setIsAddModalOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}>Ad Soyad</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={{ padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: '500' }}
                                            placeholder="Görüşülen kişi"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}>İşletme Adı</label>
                                        <input
                                            type="text"
                                            value={formData.restaurant}
                                            onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                                            style={{ padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: '500' }}
                                            placeholder="Restoran adı"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}>E-Posta</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            style={{ padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: '500' }}
                                            placeholder="ornek@mail.com"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}>Telefon</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            style={{ padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: '500' }}
                                            placeholder="05..."
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}>Görüşme Notları</label>
                                    <textarea
                                        rows={4}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        style={{ padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: '500', resize: 'none' }}
                                        placeholder="Görüşme detaylarını buraya not alın..."
                                    />
                                </div>
                                <button
                                    disabled={isSaving}
                                    style={{ marginTop: '12px', background: '#111827', color: '#fff', padding: '18px', borderRadius: '18px', border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)' }}
                                    className="hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={24} className="animate-spin" /> : 'Lead Kaydını Başlat'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
