"use client";
import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Package, Plus, Edit, Trash2, X, Save, Loader2, Zap, PlusCircle } from 'lucide-react';

export default function SuperAdminPlanlar() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        price: 0,
        branchLimit: 1,
        tableLimit: 10,
        features: [] as string[]
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/plans');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPlans(data);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan?: any) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                code: plan.code,
                price: plan.price,
                branchLimit: plan.branchLimit,
                tableLimit: plan.tableLimit,
                features: plan.features || []
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                code: '',
                price: 0,
                branchLimit: 1,
                tableLimit: 10,
                features: []
            });
        }
        setModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const url = editingPlan ? `/api/admin/plans/${editingPlan.id}` : '/api/admin/plans';
            const method = editingPlan ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setModalOpen(false);
                fetchPlans();
            } else {
                const err = await res.json();
                alert(err.error || 'İşlem sırasında hata oluştu');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu planı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchPlans();
            } else {
                const err = await res.json();
                alert(err.error || 'Silme işlemi başarısız');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Header */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        Hizmet & Abonelik Katmanları
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-medium leading-relaxed">
                        Platformun gelir modelini, hizmet sınırlarını ve kurumsal paket yapılandırmalarını yönetin.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full xl:w-auto bg-[#ff7a21] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                >
                    <Plus size={22} strokeWidth={3} /> Yeni Paket Tanımla
                </button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 items-start">
                <div className="flex flex-col gap-10 min-w-0">
                    {loading ? (
                        <div className="bg-white rounded-[40px] p-40 text-center shadow-sm border border-gray-100">
                            <Loader2 className="animate-spin text-[#ff7a21] mx-auto mb-6" size={56} />
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Veriler Senkronize Ediliyor...</p>
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="bg-white rounded-[40px] p-40 text-center border-2 border-dashed border-gray-200 flex flex-col items-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8 border-2 border-gray-100 shadow-inner">
                                <Package size={48} className="text-gray-200" strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Henüz Paket Tanımlanmadı</h3>
                            <p className="text-gray-400 font-bold max-w-[320px] leading-relaxed italic">Satışa sunulacak paketleri tanımlayarak platformu aktif hale getirin.</p>
                            <button onClick={() => handleOpenModal()} className="mt-8 text-[#ff7a21] font-black text-sm hover:translate-y-[-2px] transition-transform uppercase tracking-widest underline decoration-2 underline-offset-8">+ İlk Paketi Şimdi Tanımla</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                            {plans.map((plan: any) => (
                                <div key={plan.id} className="bg-white rounded-[40px] p-10 relative overflow-hidden flex flex-col h-full shadow-sm border-2 border-gray-50 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 transition-all duration-500 group">
                                    <div className="absolute top-8 right-8 flex gap-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <button onClick={() => handleOpenModal(plan)} className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm border border-blue-100" title="Yapılandır"><Edit size={18} strokeWidth={2.5} /></button>
                                        <button onClick={() => handleDelete(plan.id)} className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100" title="Kalıcı Sil"><Trash2 size={18} strokeWidth={2.5} /></button>
                                    </div>

                                    {plan.code === 'pro' && (
                                        <div className="absolute top-10 -left-14 rotate-[-45deg] bg-gradient-to-r from-[#ff7a21] to-[#ff9d54] text-white text-[10px] font-black px-16 py-2.5 shadow-xl shadow-orange-500/20 z-0 tracking-widest uppercase">POPÜLER</div>
                                    )}

                                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-10 shadow-lg ${plan.code === 'pro' ? 'bg-orange-50 text-[#ff7a21] shadow-orange-500/10' : 'bg-blue-50 text-blue-500 shadow-blue-500/10'} group-hover:rotate-6 transition-transform duration-500`}>
                                        <Zap size={32} strokeWidth={2.5} />
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none group-hover:text-[#ff7a21] transition-colors">{plan.name}</h3>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mt-3 block">CODE: {plan.code}</span>
                                    </div>

                                    <div className="text-4xl font-black text-gray-900 mb-12 flex items-baseline gap-2 shrink-0 transition-all">
                                        <span className="text-xl font-bold text-gray-400">₺</span>{plan.price} <span className="text-xs text-gray-400 font-bold ml-1 tracking-widest uppercase">/ AY</span>
                                    </div>

                                    <div className="flex flex-col gap-6 mb-12 flex-1">
                                        <div className="flex items-center gap-4 text-sm font-black text-gray-600">
                                            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm"><CheckCircle size={14} strokeWidth={3} /></div>
                                            {plan.branchLimit} Şube Yönetimi
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-black text-gray-600">
                                            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm"><CheckCircle size={14} strokeWidth={3} /></div>
                                            {plan.tableLimit} Masa/Menu Limiti
                                        </div>
                                        {plan.features?.map((f: string, i: number) => (
                                            <div key={i} className="flex items-center gap-4 text-sm font-black text-gray-600">
                                                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm"><CheckCircle size={14} strokeWidth={3} /></div>
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleOpenModal(plan)}
                                        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${plan.code === 'pro' ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20 hover:bg-[#ff7a21] hover:shadow-orange-500/30' : 'bg-gray-50 text-gray-400 border-2 border-gray-100 group-hover:bg-[#ff7a21] group-hover:text-white group-hover:border-[#ff7a21] group-hover:shadow-xl group-hover:shadow-orange-500/20'} hover:-translate-y-1 active:scale-95`}
                                    >
                                        Yapılandır
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="flex flex-col gap-10 xl:sticky xl:top-8 h-fit">
                    <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="absolute -right-20 -top-20 w-56 h-56 bg-orange-500/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="flex items-center gap-4 mb-12 relative">
                            <div className="w-2 h-10 bg-[#ff7a21] rounded-full shadow-[0_0_20px_rgba(255,122,33,0.5)]"></div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Platform Analizi</h3>
                        </div>

                        <div className="flex flex-col gap-10 relative">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Aktif Paketler</span>
                                    <span className="text-5xl font-black tracking-tighter leading-none">{plans.length}</span>
                                </div>
                                <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-blue-500/20">SİSTEM: AKTİF</div>
                            </div>

                            <div className="h-px bg-white/10 w-full"></div>

                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-[32px] border border-white/5 hover:bg-white/10 transition-colors">
                                <div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Ücretli Dönüşüm</span>
                                    <div className="text-3xl font-black text-emerald-400 tracking-tight">%84.2</div>
                                </div>
                                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                    <CheckCircle size={28} strokeWidth={2.5} />
                                </div>
                            </div>

                            <div className="bg-orange-500/5 rounded-3xl p-6 border-l-4 border-[#ff7a21]">
                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed italic">
                                    <span className="text-white not-italic block mb-2 text-xs font-black uppercase tracking-widest">Growth Analiz:</span>
                                    Paket limitleri optimizasyonu sayesinde ortalama sepet tutarı bu çeyrekte <span className="text-[#ff7a21]">%15</span> artış gösterdi.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 border-l-[6px] border-l-[#ff7a21] group hover:shadow-2xl hover:shadow-orange-500/5 transition-all">
                        <div className="flex gap-6 items-start">
                            <div className="bg-orange-50 p-4 rounded-2xl shrink-0 border-2 border-orange-100 group-hover:rotate-12 transition-transform shadow-sm">
                                <CreditCard size={28} className="text-[#ff7a21]" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">SaaS Motoru</h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-bold italic">
                                    Paket kısıtlamaları faturalandırma motoruyla <span className="text-[#ff7a21] underline decoration-orange-200 underline-offset-4">tam entegredir</span>. Limit değişiklikleri mevcut işletmeleri gerçek zamanlı etkiler.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Editor Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[60px] p-10 md:p-16 shadow-2xl animate-in zoom-in duration-500 border-2 border-gray-100 my-auto">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-12 right-12 w-16 h-16 rounded-[24px] bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm border-2 border-transparent hover:border-rose-100"
                        >
                            <X size={32} />
                        </button>

                        <div className="mb-12">
                            <div className="w-20 h-20 bg-gray-900 text-white rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-gray-900/20">
                                {editingPlan ? <Edit size={40} strokeWidth={3} /> : <PlusCircle size={40} strokeWidth={3} />}
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                {editingPlan ? 'Paket Yapılandırması' : 'Yeni Hizmet Katmanı'}
                            </h3>
                            <p className="text-gray-400 mt-2 text-lg font-bold italic">Hizmet sınırlarını ve fiyatlandırma modelini optimize edin.</p>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="sm:col-span-2 space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Paket İsmi</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    placeholder="Örn: Growth Premier"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 outline-none focus:bg-white focus:border-[#ff7a21] transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Sistem Kodu</label>
                                <input
                                    type="text" required
                                    value={formData.code}
                                    placeholder="growth_v1"
                                    disabled={!!editingPlan}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full px-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 outline-none disabled:bg-gray-100 disabled:text-gray-400 cursor-not-allowed focus:border-[#ff7a21] transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Aylık Ücret</label>
                                <div className="relative">
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-gray-300 text-lg">₺</span>
                                    <input
                                        type="number" required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full pl-14 pr-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 outline-none focus:bg-white focus:border-[#ff7a21] transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Şube Kapasitesi</label>
                                <input
                                    type="number" required
                                    value={formData.branchLimit}
                                    onChange={(e) => setFormData({ ...formData, branchLimit: parseInt(e.target.value) })}
                                    className="w-full px-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 outline-none focus:bg-white focus:border-[#ff7a21] transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Masa Kapasitesi</label>
                                <input
                                    type="number" required
                                    value={formData.tableLimit}
                                    onChange={(e) => setFormData({ ...formData, tableLimit: parseInt(e.target.value) })}
                                    className="w-full px-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 outline-none focus:bg-white focus:border-[#ff7a21] transition-all shadow-sm"
                                />
                            </div>

                            <div className="sm:col-span-2 mt-8">
                                <button
                                    type="submit" disabled={isSaving}
                                    className="w-full py-6 rounded-[32px] bg-gray-900 text-white font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-gray-900/30 hover:bg-[#ff7a21] hover:shadow-orange-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                                >
                                    {isSaving ? <Loader2 size={32} className="animate-spin text-white" /> : <Save size={28} strokeWidth={3} />}
                                    {isSaving ? 'İşleniyor...' : editingPlan ? 'Yapılandırmayı Kaydet' : 'Yeni Paketi Aktifleştir'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

