"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Store,
    Globe,
    Package,
    Zap,
    CheckCircle,
    ArrowLeft,
    Check,
    ShieldCheck,
    Mail,
    Lock,
    PlusCircle,
    ChevronRight,
    Loader2,
    Users,
    FileText
} from 'lucide-react';

export default function YeniRestoranEkle() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        ownerEmail: '',
        password: '',
        planId: '',
        customDomain: '',
        isTrial: true
    });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch('/api/admin/plans');
                if (!res.ok) throw new Error('Planlar yüklenemedi');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPlans(data);
                    if (data.length > 0) setFormData(prev => ({ ...prev, planId: data[0].id }));
                }
            } catch (error) {
                console.error('Planları çekerken hata:', error);
            }
        };
        fetchPlans();
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const slug = val.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        setFormData({ ...formData, name: val, slug });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setIsSubmitting(true);
            const res = await fetch('/api/admin/tenants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStep(4); // Success step
            } else {
                alert('Kaydedilirken bir hata oluştu. Lütfen bilgileri kontrol edin.');
            }
        } catch (error) {
            console.error('Error creating tenant:', error);
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button
                        onClick={() => router.back()}
                        style={{ width: '48px', height: '48px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                        className="hover:border-orange-600 hover:text-orange-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Yeni İşletme Kaydı</h2>
                        <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '0.95rem', fontWeight: '500' }}>Platforma yeni bir restoran ekleyin ve ilk konfigürasyonu tamamlayın.</p>
                    </div>
                </div>
            </div>

            {step < 4 && (
                <>
                    {/* Step Progress */}
                    <div style={{ maxWidth: '900px', margin: '0 auto 4rem', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '3px', background: '#f1f5f9', zIndex: 0 }}>
                            <div style={{
                                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                                height: '100%',
                                background: 'linear-gradient(to right, #ea580c, #ff9d5c)',
                                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 0 10px rgba(255,122,33,0.3)'
                            }}></div>
                        </div>

                        {[1, 2, 3].map((s) => (
                            <div key={s} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '16px',
                                    background: step >= s ? '#fff' : '#f8fafc',
                                    border: '3px solid',
                                    borderColor: step >= s ? '#ea580c' : '#e2e8f0',
                                    color: step >= s ? '#ea580c' : '#cbd5e1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '900',
                                    fontSize: '1.1rem',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: step >= s ? '0 10px 15px -3px rgba(255, 122, 33, 0.15)' : 'none',
                                    transform: step === s ? 'scale(1.15)' : 'scale(1)'
                                }}>
                                    {step > s ? <Check size={24} strokeWidth={3} /> : s}
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: '900', color: step >= s ? '#111827' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {s === 1 ? 'Paket Seçimi' : s === 2 ? 'Genel Bilgiler' : 'Erişim Tanımları'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {/* Step 1: Plan Selection */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', marginBottom: '10px' }}>Uygun Hizmet Paketini Belirleyin</h3>
                                    <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>İşletmenin büyüklüğüne ve ihtiyaçlarına en uygun lisans modelini seçin.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => setFormData({ ...formData, planId: plan.id })}
                                            style={{
                                                padding: '40px 32px',
                                                borderRadius: '24px',
                                                border: '2px solid',
                                                borderColor: formData.planId === plan.id ? '#ea580c' : '#f1f5f9',
                                                background: formData.planId === plan.id ? '#fff' : '#fcfcfc',
                                                cursor: 'pointer',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                boxShadow: formData.planId === plan.id ? '0 20px 25px -5px rgba(255, 122, 33, 0.1)' : 'none',
                                                transform: formData.planId === plan.id ? 'translateY(-8px)' : 'none'
                                            }}
                                            className="plan-card-hover"
                                        >
                                            {formData.planId === plan.id && (
                                                <div style={{ position: 'absolute', top: '24px', right: '24px', color: '#ea580c', background: '#fff7ed', padding: '8px', borderRadius: '12px' }}>
                                                    <ShieldCheck size={24} />
                                                </div>
                                            )}
                                            <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>{plan.name}</div>
                                            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', marginBottom: '24px' }}>₺{plan.price}<span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600' }}> /ay</span></div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#475569', fontWeight: '600' }}>
                                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} strokeWidth={4} /></div>
                                                    {plan.branchLimit} Şube Yetkili
                                                </li>
                                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#475569', fontWeight: '600' }}>
                                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} strokeWidth={4} /></div>
                                                    {plan.tableLimit} Masa Kotası
                                                </li>
                                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#475569', fontWeight: '600' }}>
                                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} strokeWidth={4} /></div>
                                                    Adisyon & Stok Yönetimi
                                                </li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Basic Info */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 card" style={{ padding: '48px', border: 'none', background: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                                    <div style={{ width: '64px', height: '64px', background: '#eff6ff', color: '#3b82f6', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                        <Store size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', marginBottom: '10px' }}>İşletme Kimlik Bilgileri</h3>
                                    <p style={{ color: '#64748b', fontWeight: '500' }}>Restoranın platform üzerindeki görüneceği temel bilgileri tanımlayın.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '900', color: '#374151' }}>Resmi Restoran Adı</label>
                                        <input
                                            type="text"
                                            placeholder="Örn: Gurme Steakhouse & Bistro"
                                            value={formData.name}
                                            onChange={handleNameChange}
                                            style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', fontSize: '1rem', outline: 'none', fontWeight: '800', color: '#111827' }}
                                            className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '900', color: '#374151' }}>URL Bağlantı Yolu (Slug)</label>
                                        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '0 20px', transition: 'all 0.2s' }} className="focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                                            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '800', marginRight: '6px' }}>qrlamenu.com/r/</span>
                                            <input
                                                type="text"
                                                placeholder="gurme-steak"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                style={{ flex: 1, padding: '16px 0', background: 'transparent', border: 'none', fontSize: '1rem', fontWeight: '900', color: '#3b82f6', outline: 'none' }}
                                            />
                                        </div>
                                        <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>* Sadece küçük harf, rakam ve tire (-) içerebilir.</p>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '900', color: '#374151' }}>Özel Alan Adı (Opsiyonel)</label>
                                        <input
                                            type="text"
                                            placeholder="www.gurmesteak.com"
                                            value={formData.customDomain}
                                            onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                            style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', fontSize: '1rem', outline: 'none', fontWeight: '800', color: '#111827' }}
                                            className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                        />
                                        <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Kendi domainini kullanacaksa buraya girin.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Access & Owner */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 card" style={{ padding: '48px', border: 'none', background: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                                    <div style={{ width: '64px', height: '64px', background: '#fff1f2', color: '#f43f5e', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                        <Users size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', marginBottom: '10px' }}>Erişim & Sorumlu Tanımı</h3>
                                    <p style={{ color: '#64748b', fontWeight: '500' }}>İşletmenin yönetiminden sorumlu olacak ana kullanıcı yetkilerini tanımlayın.</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '900', color: '#374151' }}>Sorumlu Yönetici E-posta</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                type="email"
                                                placeholder="admin@restoranadi.com"
                                                value={formData.ownerEmail}
                                                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                                                style={{ width: '100%', padding: '16px 20px 16px 56px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', fontSize: '1rem', outline: 'none', fontWeight: '800', color: '#111827' }}
                                                className="focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                                            />
                                        </div>
                                        <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Bu adrese kurulum tamamlandığında bir aktivasyon e-postası gönderilecektir.</p>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '900', color: '#374151' }}>Geçici Erişim Şifresi</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                type="password"
                                                placeholder="Güçlü bir şifre oluşturun"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                style={{ width: '100%', padding: '16px 20px 16px 56px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', fontSize: '1rem', outline: 'none', fontWeight: '800', color: '#111827' }}
                                                className="focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', padding: '0 10px' }}>
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                style={{ padding: '16px 40px', borderRadius: '16px', border: '1px solid #e2e8f0', background: step === 1 ? '#f9fafb' : '#fff', color: step === 1 ? '#cbd5e1' : '#64748b', fontWeight: '900', cursor: step === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                                className="hover:bg-slate-50"
                            >
                                Geri Dön
                            </button>
                            {step < 3 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={step === 1 && !formData.planId}
                                    style={{ padding: '16px 50px', borderRadius: '16px', border: 'none', background: (step === 1 && !formData.planId) ? '#ffedd5' : '#ea580c', color: '#fff', fontWeight: '900', fontSize: '1rem', cursor: (step === 1 && !formData.planId) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', transition: 'all 0.2s' }}
                                    className="hover:scale-105 active:scale-95"
                                >
                                    Sonraki Adım <ChevronRight size={22} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    style={{ padding: '16px 60px', borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)', transition: 'all 0.2s' }}
                                    className="hover:scale-105 active:scale-95"
                                >
                                    {loading ? <Loader2 size={22} className="animate-spin" /> : <PlusCircle size={22} />}
                                    {loading ? 'Kurulum Başlatıldı...' : 'İşletme Kaydını Tamamla'}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Step 4: Success Message */}
            {step === 4 && (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease', padding: '60px 0', maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: '#f0fdf4',
                        color: '#10b981',
                        borderRadius: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 40px',
                        boxShadow: '0 20px 40px rgba(16,185,129,0.1)'
                    }}>
                        <CheckCircle size={64} />
                    </div>
                    <h3 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px', letterSpacing: '-0.02em' }}>İşletme Başarıyla Kuruldu!</h3>
                    <p style={{ color: '#64748b', marginBottom: '48px', lineHeight: '1.7', fontSize: '1.1rem', fontWeight: '500' }}>
                        <b style={{ color: '#1e293b' }}>{formData.name}</b> başarıyla sisteme kaydedildi. Restoran sahibi bilgilendirildi ve panel erişimi aktif edildi.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <button
                            style={{ padding: '18px 48px', borderRadius: '20px', background: '#0f172a', color: '#fff', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(15,23,42,0.15)', transition: 'all 0.2s' }}
                            onClick={() => window.location.href = '/super-admin/restoranlar'}
                            className="hover:scale-105 active:scale-95"
                        >
                            Yönetim Paneline Dön
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .plan-card-hover:hover {
                    border-color: #ea580c !important;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
