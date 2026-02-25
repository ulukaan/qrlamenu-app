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
        { label: 'Ürün', value: tenant._count?.products || 0, icon: <UtensilsCrossed size={16} />, color: '#ea580c' },
        { label: 'Kategori', value: tenant._count?.categories || 0, icon: <LayoutGrid size={16} />, color: '#3b82f6' },
        { label: 'Sipariş', value: tenant._count?.orders || 0, icon: <Package size={16} />, color: '#10b981' },
        { label: 'Yönetici', value: tenant._count?.users || 0, icon: <Users size={16} />, color: '#8b5cf6' },
    ];

    return (
        <div className="px-6 py-8 w-full max-w-full">
            {/* Header */}
            <div className="flex items-start md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 border border-slate-200 bg-white rounded-[6px] flex items-center justify-center text-slate-500 hover:border-slate-300 hover:text-slate-900 shadow-sm transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">{tenant.name}</h1>
                            <span className={`
                                px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase border
                                ${tenant.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}
                            `}>
                                {tenant.status === 'ACTIVE' ? 'SİSTEMDE AKTİF' : 'ASKIYA ALINDI'}
                            </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-[4px] inline-block mb-0">GLOBAL ID: {tenant.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full sm:w-auto h-9 px-4 rounded-[6px] border border-rose-200 bg-white text-rose-500 font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-rose-50 transition-all shadow-sm"
                    >
                        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        İşletmeyi Kalıcı Sil
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full sm:w-auto h-9 px-4 rounded-[6px] bg-slate-900 text-white font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-sm"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Veriler İşleniyor...' : 'Konfigürasyonu Güncelle'}
                    </button>
                </div>
            </div>

            <div className="h-px bg-slate-200/60 w-full mb-10" />

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-10">
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
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '0.8rem', fontWeight: '900', color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Müşteri Deneyimi</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9a3412', marginBottom: '24px', fontWeight: '600', lineHeight: '1.5' }}>Restoran menüsünün müşteri tarafındaki görünümünü anlık olarak inceleyin.</p>
                        <a
                            href={`/r/${tenant.slug}`}
                            target="_blank"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', background: '#ea580c', borderRadius: '14px', color: '#fff', fontWeight: '900', fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.2)', transition: 'all 0.2s' }}
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
                <div className="flex flex-col gap-6">
                    {/* General Info */}
                    <div className="bg-white rounded-[6px] p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-slate-50 text-slate-600 p-2 rounded-[4px] border border-slate-100">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Kimlik & İletişim</h3>
                                <p className="text-[12px] font-medium text-slate-500 mt-0.5">Temel işletme tanımları ve sahip bilgileri.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            <div className="md:col-span-2">
                                <label className="block mb-2 text-[12px] font-bold text-slate-700">Restoran Kamu Adı</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-10 px-4 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-[12px] font-bold text-slate-700">Sorumlu E-posta</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={formData.ownerEmail}
                                        onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                                        className="flex-1 h-10 px-4 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleResetOwnerPassword}
                                        title="Şifre Sıfırlama Talimatı Gönder"
                                        className="w-10 h-10 border border-slate-200 rounded-[6px] bg-white text-slate-500 hover:border-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center shrink-0"
                                    >
                                        <LockIcon size={16} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-[12px] font-bold text-slate-700">Yayın Statüsü</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all appearance-none cursor-pointer"
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
                    <div className="bg-white rounded-[6px] p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-slate-50 text-slate-600 p-2 rounded-[4px] border border-slate-100">
                                <GlobeIcon size={20} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Bağlantı Ayarları</h3>
                                <p className="text-[12px] font-medium text-slate-500 mt-0.5">URL yapılandırması ve özel alan adları.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block mb-2 text-[12px] font-bold text-slate-700">Platform URL (Slug)</label>
                                <div className="flex items-center border border-slate-200 rounded-[6px] h-10 px-4 bg-slate-50 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all overflow-hidden">
                                    <span className="text-[13px] text-slate-500 font-semibold mr-1 shrink-0">qrlamenu.com/r/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-transparent border-none text-[13px] font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                                <p className="mt-1.5 text-[11px] text-slate-400 font-medium">* Sadece küçük harf, rakam ve tire (-) içerebilir.</p>
                            </div>
                            <div>
                                <label className="block mb-2 text-[12px] font-bold text-slate-700">Özel Alan Adı</label>
                                <input
                                    type="text"
                                    placeholder="restoranadi.com"
                                    value={formData.customDomain}
                                    onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                    className="w-full h-10 px-4 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                />
                                <p className="mt-1.5 text-[11px] text-slate-400 font-medium">İşletmenin kendi alan adını buraya yönlendirebilirsiniz.</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription & Trial */}
                    <div className="bg-white rounded-[6px] p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-50 text-slate-600 p-2 rounded-[4px] border border-slate-100">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Lisans & Abonelik</h3>
                                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">Aktif hizmet paketi ve kullanım limitleri.</p>
                                </div>
                            </div>
                            {formData.status === 'TRIAL' && (
                                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-[4px] border border-amber-200 text-amber-700">
                                    <label className="text-[10px] font-bold uppercase tracking-wider">TRIAL BİTİŞ:</label>
                                    <input
                                        type="date"
                                        value={formData.trialExpiresAt}
                                        onChange={(e) => setFormData({ ...formData, trialExpiresAt: e.target.value })}
                                        className="bg-transparent border-none text-[11px] font-bold text-amber-900 outline-none w-24"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => setFormData({ ...formData, planId: plan.id })}
                                    className={`
                                        p-5 rounded-[6px] border cursor-pointer transition-all relative flex flex-col items-center text-center
                                        ${formData.planId === plan.id ? 'border-slate-900 bg-slate-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'}
                                    `}
                                >
                                    {formData.planId === plan.id && (
                                        <div className="absolute top-3 right-3 text-slate-900">
                                            <ShieldCheck size={18} />
                                        </div>
                                    )}
                                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">{plan.name}</div>
                                    <div className="text-xl font-bold text-slate-900 mb-5 flex items-end gap-1">
                                        ₺{plan.price}<span className="text-[12px] text-slate-500 font-semibold mb-1">/ay</span>
                                    </div>
                                    <div className="text-[11px] font-semibold text-slate-700 w-full flex flex-col gap-2">
                                        <div className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {plan.branchLimit} Şube Yetkisi</div>
                                        <div className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {plan.tableLimit} Masa Limiti</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Theme Customization */}
                    <div className="bg-white rounded-[6px] p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-50 text-slate-600 p-2 rounded-[4px] border border-slate-100">
                                    <LayoutGrid size={20} />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Görünüm & Tema</h3>
                                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">Aktif kullanılan arayüz şablonu.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(THEMES).map(([key, config]: [string, any]) => (
                                <div
                                    key={key}
                                    onClick={() => setFormData({ ...formData, theme: key })}
                                    className={`
                                        cursor-pointer rounded-[6px] border overflow-hidden transition-all relative
                                        ${formData.theme === key ? 'border-emerald-500 shadow-sm' : 'border-slate-200 hover:border-slate-300'}
                                    `}
                                >
                                    <div className="h-20 bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
                                        <span className="text-[20px] font-bold" style={{ color: config.colors.primary }}>{key[0].toUpperCase()}</span>
                                        {formData.theme === key && (
                                            <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                                <ShieldCheck size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 text-center bg-white">
                                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{config.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Management & Logs */}
                <div className="flex flex-col gap-6">
                    {/* Subscription Status Card */}
                    <div className="bg-slate-900 rounded-[6px] p-6 border border-slate-800 text-white shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-slate-800 text-slate-400 p-2 rounded-[4px]">
                                <CreditCard size={18} />
                            </div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Abonelik Özeti</h3>
                        </div>
                        <div className="mb-6">
                            <div className="text-[10px] text-slate-500 font-bold mb-1 tracking-wider uppercase">MEVCUT LİSANS PAKETİ</div>
                            <div className="text-xl font-bold text-white tracking-tight">{tenant.plan?.name || 'BELİRSİZ PLAN'}</div>
                        </div>
                        <div className="flex flex-col gap-4 border-t border-slate-800 pt-5">
                            <div className="flex justify-between items-center text-[12px]">
                                <span className="text-slate-400 font-semibold">Platform Durumu:</span>
                                <span className={`font-bold ${tenant.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {tenant.status === 'ACTIVE' ? 'SİSTEMDE AKTİF' : 'ERİŞİM KISITLI'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[12px]">
                                <span className="text-slate-400 font-semibold">Kayıt Tarihi:</span>
                                <span className="font-bold text-white">{new Date(tenant.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-white rounded-[6px] p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-slate-50 text-slate-600 p-2 rounded-[4px] border border-slate-100">
                                <FileText size={18} />
                            </div>
                            <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Sistem Notları</h3>
                        </div>
                        <textarea
                            placeholder="Bu işletme hakkında dahili yönetici notları ekleyin..."
                            className="w-full h-32 p-4 rounded-[6px] border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-700 outline-none resize-none focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
                        ></textarea>
                        <button className="mt-4 w-full h-9 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold transition-colors border border-slate-200">
                            Notu Kaydet
                        </button>
                    </div>

                    {/* Activity Log Simulation */}
                    <div className="bg-white rounded-[6px] p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-slate-50 text-slate-600 p-2 rounded-[4px] border border-slate-100">
                                <History size={18} />
                            </div>
                            <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">İşlem Günlüğü</h3>
                        </div>
                        <div className="flex flex-col gap-5">
                            {[
                                { title: 'Plan Güncellemesi', user: 'Samet Dursun', time: '2 saat önce', color: 'bg-blue-500' },
                                { title: 'Restoran Doğrulandı', user: 'Sistem', time: 'Dün', color: 'bg-emerald-500' },
                                { title: 'Logo Değişikliği', user: 'Yönetici', time: '3 gün önce', color: 'bg-orange-500' }
                            ].map((log, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.color}`} />
                                    <div>
                                        <div className="text-[13px] font-bold text-slate-900 leading-tight">{log.title}</div>
                                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">{log.time} · {log.user}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 w-full h-9 border border-slate-200 border-dashed rounded-[6px] text-[12px] font-bold text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-colors">
                            Tüm Sistem Kayıtlarını İncele
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
