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
        <div className="px-6 py-8 w-full max-w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Hizmet & Abonelik Paketleri</h1>
                    <p className="text-[12px] text-slate-500 mt-1 font-medium bg-slate-100 px-2 py-0.5 rounded-[4px] inline-block mb-0 uppercase tracking-widest">SaaS Motoru Gelir Modeli ve Limit Yönetimi</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="h-9 px-4 rounded-[6px] border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                    <Plus size={16} /> Yeni Paket Tanımla
                </button>
            </div>

            <div className="h-px bg-slate-200/60 w-full mb-10" />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
                <div className="flex flex-col gap-6 min-w-0">
                    {loading ? (
                        <div className="bg-white rounded-[6px] p-24 text-center shadow-sm border border-slate-200">
                            <Loader2 className="animate-spin text-slate-400 mx-auto mb-4" size={32} />
                            <p className="text-slate-500 font-semibold text-[13px]">Veriler yükleniyor...</p>
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="bg-white rounded-[6px] p-24 text-center border border-dashed border-slate-300 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-[6px] border border-slate-200 mb-4">
                                <Package size={24} className="text-slate-400" />
                            </div>
                            <h3 className="text-[16px] font-bold text-slate-900 mb-2">Henüz Paket Bulunamadı</h3>
                            <p className="text-[13px] text-slate-500 font-medium max-w-[300px]">Faturalandırmaya başlamak için hemen bir ilk hizmet paketi tanımlayın.</p>
                            <button onClick={() => handleOpenModal()} className="mt-6 text-indigo-600 font-semibold text-[13px] hover:text-indigo-700 hover:underline inline-flex items-center gap-1"><Plus size={14} /> Yeni Paket Tanımla</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map((plan: any) => (
                                <div key={plan.id} className="bg-white rounded-[6px] p-6 relative flex flex-col h-full shadow-sm border border-slate-200 hover:border-slate-300 transition-all group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(plan)} className="w-8 h-8 rounded-[4px] bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200" title="Düzenle"><Edit size={14} /></button>
                                        <button onClick={() => handleDelete(plan.id)} className="w-8 h-8 rounded-[4px] bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-all border border-rose-200" title="Sil"><Trash2 size={14} /></button>
                                    </div>

                                    <div className="mb-5 pr-20">
                                        {plan.code === 'pro' && (
                                            <span className="inline-block px-2 py-0.5 rounded-[4px] bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-3 border border-indigo-100">POPÜLER PAKET</span>
                                        )}
                                        <h3 className="text-[18px] font-bold text-slate-900 tracking-tight leading-tight">{plan.name}</h3>
                                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-1 block">Kod: {plan.code}</span>
                                    </div>

                                    <div className="text-3xl font-bold text-slate-900 mb-6 flex items-baseline gap-1">
                                        <span className="text-lg font-medium text-slate-500">₺</span>{plan.price} <span className="text-[12px] text-slate-500 font-semibold ml-1">/ ay</span>
                                    </div>

                                    <div className="flex flex-col gap-3 mb-8 flex-1">
                                        <div className="flex items-center gap-3 text-[13px] font-semibold text-slate-700">
                                            <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100"><CheckCircle size={12} strokeWidth={3} /></div>
                                            {plan.branchLimit} Şube Kapasitesi
                                        </div>
                                        <div className="flex items-center gap-3 text-[13px] font-semibold text-slate-700">
                                            <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100"><CheckCircle size={12} strokeWidth={3} /></div>
                                            {plan.tableLimit} Masa/Menü Limiti
                                        </div>
                                        {plan.features?.map((f: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 text-[13px] font-semibold text-slate-700">
                                                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100"><CheckCircle size={12} strokeWidth={3} /></div>
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleOpenModal(plan)}
                                        className="w-full h-10 rounded-[6px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-semibold transition-colors"
                                    >
                                        Planı Yapılandır
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="flex flex-col gap-6 xl:sticky xl:top-8 h-fit">
                    <div className="bg-slate-900 rounded-[6px] p-6 text-white shadow-sm border border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-slate-800 text-slate-400 p-2 rounded-[4px]">
                                <CreditCard size={18} />
                            </div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Platform İstatistikleri</h3>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] text-slate-500 font-bold mb-1 tracking-wider uppercase block">Toplam Paket Sayısı</span>
                                    <span className="text-3xl font-bold tracking-tight">{plans.length}</span>
                                </div>
                                <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-widest border border-indigo-500/20 uppercase">SİSTEM.AKTİF</div>
                            </div>

                            <div className="h-px bg-slate-800 w-full" />

                            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-[6px] border border-slate-800">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Ortalama Dönüşüm</span>
                                    <div className="text-xl font-bold text-emerald-400 tracking-tight">%84.2</div>
                                </div>
                                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-[4px] flex items-center justify-center border border-emerald-500/20">
                                    <CheckCircle size={20} />
                                </div>
                            </div>

                            <div className="bg-indigo-500/5 rounded-[6px] p-4 border border-indigo-500/10">
                                <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={14} /> Growth Bilgi</h4>
                                <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                                    Paket limitleri optimizasyonlarına bağlı olarak çapraz geçiş (up-sell) oranları bu çeyrekte <span className="text-indigo-400 font-bold">%15 artış</span> gösterdi.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-[6px] p-5 border border-amber-200 shadow-sm flex gap-4 items-start">
                        <div className="bg-amber-100 p-2 rounded-[4px] shrink-0 text-amber-600 mt-0.5">
                            <CreditCard size={18} />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-amber-900 mb-1">SaaS Motoru Entegrasyonu</h4>
                            <p className="text-[12px] text-amber-700 font-medium leading-relaxed">
                                Paketlerde yapacağınız kısıtlama ve limit değişiklikleri, aktif aboneliği bulunan mevcut işletmelerin <span className="font-bold underline">kullanım haklarını anında etkiler</span>.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Editor Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-[6px] p-6 shadow-xl animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-[4px] bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                        >
                            <X size={16} />
                        </button>

                        <div className="mb-6 flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-[6px] border border-indigo-100 flex items-center justify-center shrink-0">
                                {editingPlan ? <Edit size={20} /> : <PlusCircle size={20} />}
                            </div>
                            <div>
                                <h3 className="text-[16px] font-bold text-slate-900 tracking-tight leading-tight">
                                    {editingPlan ? 'Paket Ayarlarını Düzenle' : 'Yeni Abonelik Paketi'}
                                </h3>
                                <p className="text-[12px] text-slate-500 font-medium">Satış paketinin özelliklerini yapılandırın.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-y-auto pr-2 pb-2">
                            <div className="sm:col-span-2">
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">Paket İsmi</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    placeholder="Örn: Profesyonel"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">Sistem Kodu</label>
                                <input
                                    type="text" required
                                    value={formData.code}
                                    placeholder="pro_v1"
                                    disabled={!!editingPlan}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none disabled:bg-slate-50 disabled:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">Aylık Ücret (₺)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-500 text-[13px]">₺</span>
                                    <input
                                        type="number" required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full pl-8 pr-3 h-10 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all tracking-wide"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">Şube Kapasitesi</label>
                                <input
                                    type="number" required
                                    value={formData.branchLimit}
                                    onChange={(e) => setFormData({ ...formData, branchLimit: parseInt(e.target.value) })}
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">Masa / Kapasitesi</label>
                                <input
                                    type="number" required
                                    value={formData.tableLimit}
                                    onChange={(e) => setFormData({ ...formData, tableLimit: parseInt(e.target.value) })}
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                                />
                            </div>

                            <div className="sm:col-span-2 mt-4">
                                <button
                                    type="submit" disabled={isSaving}
                                    className="w-full h-10 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[13px] shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isSaving ? 'Kaydediliyor...' : editingPlan ? 'Yapılandırmayı Güncelle' : 'Paketi Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

