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
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                            <span>PANEL</span>
                            <ChevronRight size={8} className="text-slate-300" />
                            <span>RESTORANLAR</span>
                            <ChevronRight size={8} className="text-slate-300" />
                            <span className="text-slate-900">YENİ KAYIT</span>
                        </div>
                        <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Yeni İşletme Kaydı</h2>
                        <p className="text-[13px] font-medium text-slate-500 mt-1.5">Platforma yeni bir restoran ekleyin ve ilk konfigürasyonu tamamlayın.</p>
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-200/60 w-full mb-10" />

            {step < 4 && (
                <>
                    {/* Step Progress */}
                    <div className="max-w-3xl mx-auto mb-12 flex justify-between relative">
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 z-0">
                            <div
                                className="h-full bg-slate-900 transition-all duration-500"
                                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                            />
                        </div>

                        {[1, 2, 3].map((s) => (
                            <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`
                                    w-8 h-8 rounded-[6px] flex items-center justify-center text-[13px] font-bold transition-all duration-300 border
                                    ${step >= s ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-400'}
                                `}>
                                    {step > s ? <Check size={16} strokeWidth={3} /> : s}
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {s === 1 ? 'Paket Seçimi' : s === 2 ? 'Genel Bilgiler' : 'Erişim Tanımları'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {/* Step 1: Plan Selection */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center mb-10">
                                    <h3 className="text-[18px] font-bold text-slate-900 tracking-tight mb-2">Uygun Hizmet Paketini Belirleyin</h3>
                                    <p className="text-[13px] font-medium text-slate-500">İşletmenin büyüklüğüne ve ihtiyaçlarına en uygun lisans modelini seçin.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => setFormData({ ...formData, planId: plan.id })}
                                            className={`
                                                p-6 rounded-[6px] border cursor-pointer transition-all relative flex flex-col items-center text-center
                                                ${formData.planId === plan.id ? 'border-slate-900 bg-slate-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'}
                                            `}
                                        >
                                            {formData.planId === plan.id && (
                                                <div className="absolute top-4 right-4 text-slate-900">
                                                    <ShieldCheck size={20} />
                                                </div>
                                            )}
                                            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">{plan.name}</div>
                                            <div className="text-2xl font-bold text-slate-900 mb-6 flex items-end gap-1">
                                                ₺{plan.price}<span className="text-[13px] text-slate-500 font-semibold mb-1">/ay</span>
                                            </div>
                                            <ul className="flex flex-col gap-3 w-full">
                                                <li className="flex items-center gap-3 text-[13px] font-medium text-slate-700">
                                                    <div className="w-5 h-5 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                    {plan.branchLimit} Şube Yetkili
                                                </li>
                                                <li className="flex items-center gap-3 text-[13px] font-medium text-slate-700">
                                                    <div className="w-5 h-5 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                    {plan.tableLimit} Masa Kotası
                                                </li>
                                                <li className="flex items-center gap-3 text-[13px] font-medium text-slate-700 text-left">
                                                    <div className="w-5 h-5 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                    Adisyon & Stok Yön.
                                                </li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Basic Info */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-[6px] border border-slate-200 shadow-sm">
                                <div className="text-center mb-10">
                                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-[6px] border border-slate-200 flex items-center justify-center mx-auto mb-4">
                                        <Store size={24} />
                                    </div>
                                    <h3 className="text-[18px] font-bold text-slate-900 tracking-tight mb-2">İşletme Kimlik Bilgileri</h3>
                                    <p className="text-[13px] font-medium text-slate-500">Restoranın platform üzerindeki görüneceği temel bilgileri tanımlayın.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block mb-2 text-[12px] font-bold text-slate-700">Resmi Restoran Adı</label>
                                        <input
                                            type="text"
                                            placeholder="Örn: Gurme Steakhouse & Bistro"
                                            value={formData.name}
                                            onChange={handleNameChange}
                                            className="w-full px-4 h-10 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-[12px] font-bold text-slate-700">URL Bağlantı Yolu (Slug)</label>
                                        <div className="flex items-center border border-slate-200 rounded-[6px] px-4 h-10 bg-slate-50 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all overflow-hidden">
                                            <span className="text-[13px] text-slate-500 font-semibold mr-1 shrink-0">qrlamenu.com/r/</span>
                                            <input
                                                type="text"
                                                placeholder="gurme-steak"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                className="w-full bg-transparent border-none text-[13px] font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                        <p className="mt-1.5 text-[11px] text-slate-400 font-medium">* Sadece küçük harf, rakam ve tire (-) içerebilir.</p>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-[12px] font-bold text-slate-700">Özel Alan Adı (Opsiyonel)</label>
                                        <input
                                            type="text"
                                            placeholder="www.gurmesteak.com"
                                            value={formData.customDomain}
                                            onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                            className="w-full px-4 h-10 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                        />
                                        <p className="mt-1.5 text-[11px] text-slate-400 font-medium">Kendi domainini kullanacaksa buraya girin.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Access & Owner */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-[6px] border border-slate-200 shadow-sm">
                                <div className="text-center mb-10">
                                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-[6px] border border-slate-200 flex items-center justify-center mx-auto mb-4">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="text-[18px] font-bold text-slate-900 tracking-tight mb-2">Erişim & Sorumlu Tanımı</h3>
                                    <p className="text-[13px] font-medium text-slate-500">İşletmenin yönetiminden sorumlu olacak ana kullanıcı yetkilerini tanımlayın.</p>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div>
                                        <label className="block mb-2 text-[12px] font-bold text-slate-700">Sorumlu Yönetici E-posta</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="email"
                                                placeholder="admin@restoranadi.com"
                                                value={formData.ownerEmail}
                                                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                                                className="w-full pl-10 pr-4 h-10 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                        <p className="mt-1.5 text-[11px] text-slate-400 font-medium">Bu adrese kurulum tamamlandığında bir aktivasyon e-postası gönderilecektir.</p>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-[12px] font-bold text-slate-700">Geçici Erişim Şifresi</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                placeholder="Güçlü bir şifre oluşturun"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full pl-10 pr-4 h-10 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`
                                    h-10 px-6 rounded-[6px] text-[13px] font-semibold border transition-all
                                    ${step === 1 ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                Geri Dön
                            </button>
                            {step < 3 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={step === 1 && !formData.planId}
                                    className={`
                                        h-10 px-6 rounded-[6px] text-[13px] font-semibold flex items-center gap-2 transition-all
                                        ${(step === 1 && !formData.planId) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'}
                                    `}
                                >
                                    Sonraki Adım <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`
                                        h-10 px-6 rounded-[6px] text-[13px] font-semibold flex items-center gap-2 transition-all
                                        ${loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'}
                                    `}
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    {loading ? 'Kaydediliyor...' : 'Kurulumu Tamamla'}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Step 4: Success Message */}
            {step === 4 && (
                <div className="max-w-2xl mx-auto text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[12px] border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-[24px] font-bold text-slate-900 tracking-tight mb-4">İşletme Başarıyla Kuruldu!</h3>
                    <p className="text-[14px] font-medium text-slate-600 mb-8 max-w-lg mx-auto">
                        <span className="font-bold text-slate-900">{formData.name}</span> başarıyla sisteme kaydedildi. Restoran sahibi bilgilendirildi ve panel erişimi aktif edildi.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="h-10 px-6 rounded-[6px] bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 shadow-sm transition-all"
                            onClick={() => window.location.href = '/super-admin/restoranlar'}
                        >
                            Yönetim Paneline Dön
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
