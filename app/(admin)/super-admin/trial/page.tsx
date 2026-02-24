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
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Page Header Area */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        Trial (Deneme) Yönetimi
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-medium max-w-3xl leading-relaxed">
                        Sistemdeki deneme sürecindeki işletmeleri, süre aşımlarını ve müşteri dönüşüm potansiyelini analiz edin.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff7a21] transition-colors" />
                        <input
                            type="text"
                            placeholder="İşletme adı ara..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-white/50 backdrop-blur-xl focus:border-[#ff7a21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-gray-700 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={fetchTrials}
                        className="p-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 hover:text-[#ff7a21] hover:border-orange-200 hover:shadow-lg transition-all active:scale-95 group"
                    >
                        <RefreshCcw size={22} className={`${loading ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} />
                    </button>
                </div>
            </header>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="group bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 border-2 border-transparent hover:border-orange-100 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Aktif Trial</p>
                            <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">{loading ? '...' : stats.activeCount}</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-emerald-500 text-xs font-black uppercase tracking-wider">Canlı Süreç</p>
                            </div>
                        </div>
                        <div className="bg-orange-50 p-5 rounded-3xl text-[#ff7a21] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <Clock size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="group bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 border-2 border-transparent hover:border-rose-100 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Kritik (48 Saat)</p>
                            <h3 className="text-5xl font-black text-rose-500 tracking-tighter leading-none mb-4">{loading ? '...' : stats.urgentCount}</h3>
                            <p className="text-rose-500/80 text-xs font-black uppercase tracking-wider">Acil Aksiyon Gerekli</p>
                        </div>
                        <div className="bg-rose-50 p-5 rounded-3xl text-rose-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                            <AlertCircle size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="group bg-[#0f172a] p-8 rounded-[40px] shadow-2xl shadow-blue-500/20 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex justify-between items-start text-white">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tahmini Dönüşüm</p>
                            <h3 className="text-5xl font-black tracking-tighter leading-none mb-5">%{stats.conversion}</h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                <Zap size={12} fill="currentColor" /> <span>Trend Yukarı</span>
                            </div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-3xl text-emerald-400 border border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                            <Zap size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12">
                <div className="space-y-8 min-w-0">
                    <section className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-10 py-8 border-bottom border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Deneme Süreci İzleme Merkezi</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">İşletme Profili</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Bitiş Tarihi</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Durum</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Yönetim</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="py-32 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Loader2 size={48} className="animate-spin text-[#ff7a21]" />
                                                    <span className="text-gray-400 font-bold tracking-tight">Veriler Senkronize Ediliyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : trials.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-32 text-center">
                                                <div className="flex flex-col items-center gap-6 text-gray-200">
                                                    <Clock size={80} strokeWidth={1} />
                                                    <span className="text-gray-400 font-bold text-lg">Trial kaydı bulunmuyor.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : trials.map((row) => {
                                        const daysLeft = calculateDaysLeft(row.trialExpiresAt);
                                        return (
                                            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-10 py-8">
                                                    <div className="text-lg font-black text-gray-900 leading-tight group-hover:text-[#ff7a21] transition-colors">{row.name}</div>
                                                    <div className="text-xs text-gray-400 font-bold mt-1.5 uppercase tracking-widest">
                                                        Kurumsal ID: <span className="text-[#ff7a21]">#{row.id.substring(0, 8).toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-gray-700 font-black tracking-tight mb-1">
                                                        {new Date(row.trialExpiresAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    <div className={`text-[10px] font-black uppercase tracking-wider ${daysLeft <= 3 ? 'text-rose-500' : 'text-gray-400'}`}>
                                                        {daysLeft === 0 ? 'Bugün Sona Eriyor' : `${daysLeft} GÜN KALDI`}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${daysLeft <= 0
                                                            ? 'bg-rose-50 text-rose-500 border-rose-100'
                                                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        }`}>
                                                        {daysLeft <= 0 ? 'SÜRESİ DOLDU' : 'DENEME SÜRÜMÜ'}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTenant(row);
                                                                setModalOpen(true);
                                                            }}
                                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-gray-100 text-gray-600 font-black text-[10px] uppercase tracking-widest hover:border-orange-200 hover:text-[#ff7a21] transition-all"
                                                        >
                                                            <Calendar size={14} strokeWidth={3} /> Uzat
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdate(row.id, { status: 'ACTIVE' })}
                                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7a21] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                                                        >
                                                            <ArrowRightCircle size={14} strokeWidth={3} /> Onayla
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
                <aside className="space-y-8 xl:sticky xl:top-8 xl:h-fit">
                    <div className="bg-[#0f172a] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10 flex items-center gap-4 mb-10">
                            <div className="bg-emerald-500/20 p-3 rounded-2xl">
                                <Zap size={24} className="text-emerald-400" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Dönüşüm Rehberi</h3>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="flex gap-5">
                                <div className="mt-1 bg-emerald-500/20 p-1.5 rounded-lg h-fit">
                                    <CheckCircle size={14} className="text-emerald-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                    Sürecin <span className="text-white font-black underline decoration-emerald-500/50 underline-offset-4">7. gününde</span> atılan mesajlar dönüşümü %24 artırır.
                                </p>
                            </div>

                            <div className="h-px bg-white/5"></div>

                            <div className="flex gap-5">
                                <div className="mt-1 bg-orange-500/20 p-1.5 rounded-lg h-fit">
                                    <CheckCircle size={14} className="text-orange-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                    <span className="text-orange-400 font-black tracking-widest uppercase">WELCOME30</span> promosyon kodu ile son gün dönüşümlerini tetikleyin.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex gap-6 items-start">
                        <div className="bg-orange-50 p-4 rounded-3xl border-2 border-orange-100 shrink-0">
                            <AlertCircle size={24} className="text-[#ff7a21]" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-gray-900 tracking-tight mb-2">Otomatik Kısıtlama</h4>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                Süresi dolan restoranlar <span className="text-rose-500 font-black tracking-tight">+7 gün tolerans</span> sonunda askıya alınır.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Extend Trial Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xl flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white p-12 rounded-[50px] w-full max-w-[600px] shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-10">
                            <div className="w-16 h-16 bg-orange-50 text-[#ff7a21] rounded-[24px] flex items-center justify-center mb-8 shadow-inner">
                                <Calendar size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Süre Uzatımı</h3>
                            <p className="text-gray-500 font-medium text-lg leading-relaxed">
                                <span className="text-[#ff7a21] font-black underline underline-offset-4">{selectedTenant?.name}</span> işletmesi için deneme süresini güncelleyin.
                            </p>
                        </div>

                        <form onSubmit={handleExtend} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Uzatma Aralığı Seçin</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: '+7 Gün', value: '7' },
                                        { label: '+15 Gün', value: '15' },
                                        { label: 'Özel', value: 'custom' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setExtendDays(opt.value)}
                                            className={`py-5 rounded-3xl font-black text-sm uppercase tracking-widest border-2 transition-all shadow-sm ${extendDays === opt.value
                                                    ? 'bg-orange-50 border-[#ff7a21] text-[#ff7a21] shadow-orange-500/10'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {extendDays === 'custom' && (
                                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Yeni Bitiş Tarihi</label>
                                    <input
                                        type="date"
                                        required
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className="w-full px-8 py-5 rounded-3xl border-2 border-gray-100 bg-gray-50 focus:border-[#ff7a21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-black text-gray-700"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-6 rounded-[30px] bg-[#ff7a21] hover:bg-orange-600 text-white font-black text-lg tracking-tight shadow-2xl shadow-orange-500/30 active:scale-95 disabled:opacity-70 transition-all flex items-center justify-center gap-3 mt-8"
                            >
                                {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                Değişiklikleri Onayla ve Kaydet
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}
