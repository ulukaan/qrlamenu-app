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
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Trial (Deneme) Yönetimi</h1>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Sistemdeki deneme sürecindeki işletmeleri, süre aşımlarını ve müşteri dönüşüm potansiyelini analiz edin.</p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="İşletme adı ara..."
                            className="w-full pl-9 pr-3 py-1.5 h-9 rounded-[6px] border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-[13px] text-slate-700 bg-white"
                        />
                    </div>
                    <button
                        onClick={fetchTrials}
                        className="h-9 px-3 rounded-[6px] bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    >
                        <RefreshCcw size={16} className={`${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Corporate Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-[6px] shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-[4px]">
                            <Clock size={20} />
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-emerald-50 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Canlı Süreç</span>
                        </div>
                    </div>
                    <h3 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none mb-1">{loading ? '...' : stats.activeCount}</h3>
                    <p className="text-[12px] font-medium text-slate-500">Aktif Deneme Hesabı</p>
                </div>

                <div className="bg-white p-5 rounded-[6px] shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-[4px]">
                            <AlertCircle size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-[4px] uppercase tracking-widest">Acil Aksiyon</span>
                    </div>
                    <h3 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none mb-1">{loading ? '...' : stats.urgentCount}</h3>
                    <p className="text-[12px] font-medium text-slate-500">Kritik (Son 48 Saat)</p>
                </div>

                <div className="bg-slate-900 p-5 rounded-[6px] shadow-sm border border-slate-800 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-800 text-emerald-400 rounded-[4px]">
                            <Zap size={20} />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Zap size={10} fill="currentColor" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Trend Yukarı</span>
                        </div>
                    </div>
                    <h3 className="text-[28px] font-bold tracking-tight leading-none mb-1">%{stats.conversion}</h3>
                    <p className="text-[12px] font-medium text-slate-400">Tahmini Dönüşüm</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
                <div className="space-y-6 min-w-0">
                    <section className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Deneme Süreci İzleme Merkezi</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13px]">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500 bg-white">
                                        <th className="px-5 py-3 font-semibold w-1/3">İşletme Profili</th>
                                        <th className="px-5 py-3 font-semibold">Bitiş Tarihi</th>
                                        <th className="px-5 py-3 font-semibold">Durum</th>
                                        <th className="px-5 py-3 font-semibold text-right">Yönetim</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                                                    <span className="text-slate-500 font-medium text-[13px]">Veriler senkronize ediliyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : trials.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-400">
                                                    <Clock size={40} strokeWidth={1.5} />
                                                    <span className="font-medium text-[13px]">Trial kaydı bulunmuyor.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : trials.map((row) => {
                                        const daysLeft = calculateDaysLeft(row.trialExpiresAt);
                                        return (
                                            <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{row.name}</div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5">
                                                        ID: <span className="font-mono">{row.id.substring(0, 8)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-slate-900">
                                                        {new Date(row.trialExpiresAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                    </div>
                                                    <div className={`text-[11px] font-semibold mt-0.5 ${daysLeft <= 3 ? 'text-rose-600' : 'text-slate-500'}`}>
                                                        {daysLeft === 0 ? 'Bugün Sona Eriyor' : `${daysLeft} Gün Kaldı`}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-widest border ${daysLeft <= 0
                                                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                        }`}>
                                                        {daysLeft <= 0 ? 'Süresi Doldu' : 'Deneme'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTenant(row);
                                                                setModalOpen(true);
                                                            }}
                                                            className="flex items-center gap-1.5 h-8 px-3 rounded-[4px] bg-white border border-slate-200 text-slate-600 font-semibold text-[11px] hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
                                                        >
                                                            Uzat
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdate(row.id, { status: 'ACTIVE' })}
                                                            className="flex items-center gap-1.5 h-8 px-3 rounded-[4px] bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800 transition-colors shadow-sm"
                                                        >
                                                            Onayla
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Right Sidebar */}
                <aside className="space-y-6 xl:sticky xl:top-8 xl:h-fit">
                    <div className="bg-slate-900 p-6 rounded-[6px] text-white shadow-sm border border-slate-800 relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-3 mb-5">
                            <div className="bg-slate-800 p-2 rounded-[4px] text-emerald-400">
                                <Zap size={18} />
                            </div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Dönüşüm Rehberi</h3>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <div className="flex gap-3">
                                <div className="mt-0.5 text-emerald-400 shrink-0">
                                    <CheckCircle size={16} />
                                </div>
                                <p className="text-[12px] font-medium text-slate-300 leading-relaxed">
                                    Sürecin <span className="text-white font-semibold">7. gününde</span> atılan mesajlar dönüşümü %24 artırır.
                                </p>
                            </div>

                            <div className="h-px bg-slate-800"></div>

                            <div className="flex gap-3">
                                <div className="mt-0.5 text-indigo-400 shrink-0">
                                    <CheckCircle size={16} />
                                </div>
                                <p className="text-[12px] font-medium text-slate-300 leading-relaxed">
                                    <span className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded mr-1 text-[10px]">WLC30</span>
                                    kodu ile son gün dönüşümlerini tetikleyin.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 p-6 rounded-[6px] shadow-sm border border-rose-100 flex gap-4 items-start">
                        <div className="bg-rose-100 p-2 rounded-[4px] shrink-0 text-rose-600">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-rose-900 mb-1">Otomatik Kısıtlama</h4>
                            <p className="text-[12px] font-medium text-rose-700 leading-relaxed">
                                Süresi dolan işletmeler <span className="font-semibold">+7 gün</span> tolerans sonunda otomatik askıya alınır.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Extend Trial Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white p-8 rounded-[8px] w-full max-w-[500px] shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-[4px] transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">Süre Uzatımı</h3>
                            <p className="text-[13px] text-slate-500 mt-1">
                                <span className="font-semibold text-slate-700">{selectedTenant?.name}</span> için deneme süresi ayarlaması.
                            </p>
                        </div>

                        <form onSubmit={handleExtend} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Uzatma Aralığı</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: '+7 Gün', value: '7' },
                                        { label: '+15 Gün', value: '15' },
                                        { label: 'Özel', value: 'custom' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setExtendDays(opt.value)}
                                            className={`py-2 rounded-[4px] font-semibold text-[13px] border transition-all ${extendDays === opt.value
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {extendDays === 'custom' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Yeni Bitiş Tarihi</label>
                                    <input
                                        type="date"
                                        required
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className="w-full px-3 py-2 rounded-[6px] border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-[13px] text-slate-700 bg-white"
                                    />
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-[6px] border border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[13px] disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
