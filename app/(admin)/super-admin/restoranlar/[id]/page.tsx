"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, ExternalLink, ShieldCheck, HelpCircle, AlertTriangle, Loader2, Package, LayoutGrid, Users, UtensilsCrossed, CreditCard, Lock as LockIcon, Globe as GlobeIcon, FileText, History, MessageSquare } from 'lucide-react';
import { THEMES } from '@/lib/theme-config';

export default function EditRestaurantPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [tenant, setTenant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [plans, setPlans] = useState<any[]>([]);

    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        ownerEmail: '',
        status: '',
        planId: '',
        theme: '',
        customDomain: '',
        trialExpiresAt: ''
    });

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const [tenantRes, plansRes] = await Promise.all([
                    fetch(`/api/admin/tenants/${id}`),
                    fetch('/api/admin/plans')
                ]);

                if (!tenantRes.ok) throw new Error('Restoran bulunamadı');

                const tenantData = await tenantRes.json();
                const plansData = await plansRes.json();

                setTenant(tenantData);
                setPlans(plansData);
                setFormData({
                    name: tenantData.name,
                    slug: tenantData.slug,
                    ownerEmail: tenantData.ownerEmail,
                    status: tenantData.status,
                    planId: tenantData.planId,
                    theme: tenantData.theme,
                    customDomain: tenantData.customDomain || '',
                    trialExpiresAt: tenantData.trialExpiresAt ? new Date(tenantData.trialExpiresAt).toISOString().split('T')[0] : ''
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`/api/admin/tenants/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Restoran bilgileri başarıyla güncellendi.');
                router.refresh();
            } else {
                alert('Kaydedilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleResetOwnerPassword = async () => {
        const newPassword = prompt('Restoran sahibi için yeni şifreyi giriniz:', '123456');
        if (!newPassword) return;

        try {
            const res = await fetch(`/api/admin/tenants/${id}/reset-owner-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });
            if (res.ok) {
                alert('Restoran sahibinin şifresi başarıyla güncellendi.');
            } else {
                const data = await res.json();
                alert(data.error || 'Şifre güncellenemedi.');
            }
        } catch (err) {
            console.error(err);
            alert('Bir hata oluştu.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('DİKKAT: Bu restoranı ve tüm verilerini (kategoriler, ürünler, siparişler) kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        try {
            setDeleting(true);
            const res = await fetch(`/api/admin/tenants/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                router.push('/super-admin/restoranlar');
            } else {
                alert('Silme işlemi sırasında bir hata oluştu');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <Loader2 size={32} className="animate-spin text-gray-300" style={{ margin: '0 auto' }} />
        </div>
    );

    if (!tenant) return <div className="p-8">Restoran bulunamadı.</div>;

    const stats = [
        { label: 'Ürün', value: tenant._count?.products || 0, icon: <UtensilsCrossed size={16} />, color: '#ff7a21' },
        { label: 'Kategori', value: tenant._count?.categories || 0, icon: <LayoutGrid size={16} />, color: '#3b82f6' },
        { label: 'Sipariş', value: tenant._count?.orders || 0, icon: <Package size={16} />, color: '#10b981' },
        { label: 'Yönetici', value: tenant._count?.users || 0, icon: <Users size={16} />, color: '#8b5cf6' },
    ];

    return (
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button
                        onClick={() => router.back()}
                        style={{ width: '48px', height: '48px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                        className="hover:border-orange-500 hover:text-orange-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                            <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em' }}>{tenant.name}</h1>
                            <span style={{
                                padding: '6px 14px',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: '900',
                                background: tenant.status === 'ACTIVE' ? '#ecfdf5' : '#fff1f2',
                                color: tenant.status === 'ACTIVE' ? '#10b981' : '#f43f5e',
                                textTransform: 'uppercase',
                                border: '1px solid currentColor',
                                boxShadow: `0 0 10px ${tenant.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)'}`
                            }}>
                                {tenant.status === 'ACTIVE' ? 'SİSTEMDE AKTİF' : 'ASIKYA ALINDI'}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700', fontFamily: 'monospace', background: '#f8fafc', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>GLOBAL ID: {tenant.id.toUpperCase()}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '14px' }}>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{ padding: '14px 24px', borderRadius: '14px', border: '1px solid #f43f5e', background: '#fff', color: '#f43f5e', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
                        className="hover:bg-rose-50"
                    >
                        {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        İşletmeyi Kalıcı Sil
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary"
                        style={{ padding: '14px 32px', borderRadius: '14px', fontWeight: '900', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)' }}
                    >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        {saving ? 'Veriler İşleniyor...' : 'Konfigürasyonu Güncelle'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 340px', gap: '2.5rem' }}>
                {/* Left Sidebar: Stats & Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Stats Card */}
                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Operasyonel Metrikler</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {stats.map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', background: '#f9fafb', transition: 'all 0.2s' }} className="hover:bg-slate-50">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '0.85rem', fontWeight: '700' }}>
                                        <div style={{ color: s.color, background: '#fff', padding: '8px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>{s.icon}</div>
                                        <span>{s.label}</span>
                                    </div>
                                    <span style={{ fontWeight: '900', color: '#111827', fontSize: '1.1rem' }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Preview */}
                    <div className="card" style={{ border: 'none', padding: '32px', background: 'linear-gradient(135deg, #fff 0%, #fff7ed 100%)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '0.8rem', fontWeight: '900', color: '#ff7a21', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Müşteri Deneyimi</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9a3412', marginBottom: '24px', fontWeight: '600', lineHeight: '1.5' }}>Restoran menüsünün müşteri tarafındaki görünümünü anlık olarak inceleyin.</p>
                        <a
                            href={`/r/${tenant.slug}`}
                            target="_blank"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', background: '#ff7a21', borderRadius: '14px', color: '#fff', fontWeight: '900', fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.2)', transition: 'all 0.2s' }}
                            className="hover:scale-105"
                        >
                            Menüyü Canlı İzle <ExternalLink size={18} />
                        </a>
                    </div>

                    {/* Support Ticket Simulated */}
                    <div className="card" style={{ border: 'none', padding: '28px', background: '#f8fafc', borderLeft: '4px solid #3b82f6' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Teknik Destek</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.6', marginBottom: '20px', fontWeight: '600' }}>Bu işletme ile ilgili teknik inceleme veya yardım talebi kaydı oluşturun.</p>
                        <button style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #3b82f6', background: '#fff', color: '#3b82f6', fontSize: '0.85rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }} className="hover:bg-blue-50">
                            <MessageSquare size={16} /> Yeni Destek Talebi
                        </button>
                    </div>
                </div>

                {/* Middle: Core Form Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* General Info */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                            <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '12px', borderRadius: '14px' }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827' }}>Kimlik & İletişim</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Temel işletme tanımları ve sahip bilgileri.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: '900', color: '#374151' }}>Restoran Kamu Adı</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fcfcfc', fontSize: '1rem', outline: 'none', fontWeight: '800', color: '#111827' }}
                                    className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: '900', color: '#374151' }}>Sorumlu E-posta</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="email"
                                        value={formData.ownerEmail}
                                        onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                                        style={{ flex: 1, padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fcfcfc', fontSize: '0.95rem', outline: 'none', fontWeight: '700', color: '#111827' }}
                                        className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleResetOwnerPassword}
                                        title="Şifre Sıfırlama Talimatı Gönder"
                                        style={{ width: '52px', border: '1px solid #e2e8f0', borderRadius: '14px', background: '#fff', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        className="hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50"
                                    >
                                        <LockIcon size={20} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: '900', color: '#374151' }}>Yayın Statüsü</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fcfcfc', fontSize: '0.95rem', fontWeight: '900', outline: 'none', color: '#111827', cursor: 'pointer' }}
                                    className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                >
                                    <option value="ACTIVE">PLATFORMDA AKTİF</option>
                                    <option value="SUSPENDED">ASKIYA ALINDI / PASİF</option>
                                    <option value="TRIAL">DENEME SÜRECİNDE</option>
                                    <option value="EXPIRED">SÜRESİ DOLDU</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Domain & Path Management */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                            <div style={{ background: '#fff7ed', color: '#ff7a21', padding: '12px', borderRadius: '14px' }}>
                                <GlobeIcon size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827' }}>Bağlantı Ayarları</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>URL yapılandırması ve özel alan adları.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: '900', color: '#374151' }}>Platform URL (Slug)</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0 18px', transition: 'all 0.2s' }} className="focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-50">
                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '800', marginRight: '6px' }}>qrlamenu.com/r/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        style={{ flex: 1, padding: '14px 0', background: 'transparent', border: 'none', fontSize: '1rem', fontWeight: '900', color: '#ff7a21', outline: 'none' }}
                                    />
                                </div>
                                <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>* Sadece küçük harf, rakam ve tire (-) içerebilir.</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: '900', color: '#374151' }}>Özel Alan Adı</label>
                                <input
                                    type="text"
                                    placeholder="restoranadi.com"
                                    value={formData.customDomain}
                                    onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fcfcfc', fontSize: '0.95rem', fontWeight: '800', outline: 'none', color: '#111827' }}
                                    className="focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                                />
                                <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>İşletmenin kendi alan adını buraya yönlendirebilirsiniz.</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription & Trial */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ background: '#f5f3ff', color: '#8b5cf6', padding: '12px', borderRadius: '14px' }}>
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827' }}>Lisans & Abonelik</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Aktif hizmet paketi ve kullanım limitleri.</p>
                                </div>
                            </div>
                            {formData.status === 'TRIAL' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#8b5cf6', padding: '10px 16px', borderRadius: '12px', color: '#fff' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '900' }}>TRIAL BİTİŞ:</label>
                                    <input
                                        type="date"
                                        value={formData.trialExpiresAt}
                                        onChange={(e) => setFormData({ ...formData, trialExpiresAt: e.target.value })}
                                        style={{ padding: '4px 8px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.15)', fontSize: '0.85rem', fontWeight: '900', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => setFormData({ ...formData, planId: plan.id })}
                                    style={{
                                        padding: '24px',
                                        borderRadius: '20px',
                                        border: '2px solid',
                                        borderColor: formData.planId === plan.id ? '#8b5cf6' : '#f1f5f9',
                                        background: formData.planId === plan.id ? '#f5f3ff' : '#fff',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        boxShadow: formData.planId === plan.id ? '0 10px 15px -3px rgba(139, 92, 246, 0.2)' : 'none'
                                    }}
                                    className="plan-selector-hover"
                                >
                                    {formData.planId === plan.id && (
                                        <div style={{ position: 'absolute', top: '16px', right: '16px', color: '#8b5cf6' }}>
                                            <ShieldCheck size={22} />
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>{plan.name}</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111827', marginBottom: '12px' }}>₺{plan.price}<span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}> /ay</span></div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', lineHeight: '1.6' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} /> {plan.branchLimit} Şube Yetkisi</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} /> {plan.tableLimit} Masa Limiti</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Theme Customization */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ background: '#f0fdf4', color: '#10b981', padding: '12px', borderRadius: '14px' }}>
                                    <LayoutGrid size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827' }}>Görünüm & Tema</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Aktif kullanılan arayüz şablonu.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            {Object.entries(THEMES).map(([key, config]: [string, any]) => (
                                <div
                                    key={key}
                                    onClick={() => setFormData({ ...formData, theme: key })}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '18px',
                                        border: '2px solid',
                                        borderColor: formData.theme === key ? '#10b981' : '#f1f5f9',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: formData.theme === key ? '0 10px 15px -3px rgba(16, 185, 129, 0.15)' : 'none'
                                    }}
                                    className="theme-selector-hover"
                                >
                                    <div style={{ height: '90px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: '900', color: config.colors.primary, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{key[0].toUpperCase()}</span>
                                        {formData.theme === key && (
                                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                                                <ShieldCheck size={14} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '14px', textAlign: 'center', background: '#fff' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{config.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Management & Logs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Subscription Status Card */}
                    <div className="card" style={{ border: 'none', padding: '32px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 15px 25px -5px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '10px', borderRadius: '12px' }}>
                                <CreditCard size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Abonelik Özeti</h3>
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', fontWeight: '700' }}>MEVCUT LİSANS PAKETİ</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' }}>{tenant.plan?.name || 'BELİRSİZ PLAN'}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#94a3b8', fontWeight: '600' }}>Platform Durumu:</span>
                                <span style={{ fontWeight: '900', color: tenant.status === 'ACTIVE' ? '#4ade80' : '#f87171' }}>{tenant.status === 'ACTIVE' ? 'SİSTEMDE AKTİF' : 'ERİŞİM KISITLI'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#94a3b8', fontWeight: '600' }}>Kayıt Tarihi:</span>
                                <span style={{ fontWeight: '900' }}>{new Date(tenant.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: '#fff7ed', color: '#ff7a21', padding: '10px', borderRadius: '12px' }}>
                                <FileText size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sistem Notları</h3>
                        </div>
                        <textarea
                            placeholder="Bu işletme hakkında dahili yönetici notları ekleyin..."
                            style={{ width: '100%', height: '140px', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f9fafb', fontSize: '0.9rem', outline: 'none', resize: 'none', color: '#4b5563', fontWeight: '500', lineHeight: '1.6' }}
                            className="focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                        ></textarea>
                        <button style={{ marginTop: '16px', width: '100%', padding: '14px', borderRadius: '14px', background: '#fff', border: '1px solid #ff7a21', color: '#ff7a21', fontSize: '0.9rem', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-orange-50">
                            Notu Kaydet & Güncelle
                        </button>
                    </div>

                    {/* Activity Log Simulation */}
                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '10px', borderRadius: '12px' }}>
                                <History size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em' }}>İşlem Günlüğü</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { title: 'Plan Güncellemesi', user: 'Samet Dursun', time: '2 saat önce', color: '#3b82f6' },
                                { title: 'Restoran Doğrulandı', user: 'Sistem', time: 'Dün', color: '#10b981' },
                                { title: 'Logo Değişikliği', user: 'Yönetici', time: '3 gün önce', color: '#ff7a21' }
                            ].map((log, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '14px' }}>
                                    <div style={{ minWidth: '10px', height: '10px', borderRadius: '50%', background: log.color, marginTop: '6px', boxShadow: `0 0 8px ${log.color}` }}></div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#111827' }}>{log.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>{log.time} · {log.user}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button style={{ marginTop: '24px', width: '100%', background: 'none', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '12px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:border-blue-400 hover:text-blue-500">
                            Tüm Sistem Kayıtlarını İncele
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
