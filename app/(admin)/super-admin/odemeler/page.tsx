"use client";
import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Download, TrendingUp, DollarSign, Calendar, ArrowUpRight, Loader2, CheckCircle2, Clock, AlertCircle, Plus, Trash2, X, Save, PlusCircle } from 'lucide-react';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tenants, setTenants] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        paymentMethod: 'CREDIT_CARD',
        status: 'COMPLETED',
        tenantId: ''
    });

    useEffect(() => {
        fetchPayments();
        fetchTenants();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/payments');
            if (!res.ok) throw new Error('Ödemeler yüklenemedi');
            const data = await res.json();
            setPayments(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTenants = async () => {
        try {
            const res = await fetch('/api/admin/tenants');
            const data = await res.json();
            if (Array.isArray(data)) {
                setTenants(data);
            }
        } catch (err) {
            console.error('Tenants fetch error:', err);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const res = await fetch('/api/admin/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setModalOpen(false);
                setFormData({ title: '', amount: '', paymentMethod: 'CREDIT_CARD', status: 'COMPLETED', tenantId: '' });
                fetchPayments();
            } else {
                alert('Kaydedilirken bir hata oluştu.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu ödeme kaydını silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/admin/payments?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchPayments();
            } else {
                alert('Silme işlemi başarısız.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const monthlyRevenue = payments
        .filter(p => {
            const date = new Date(p.createdAt);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        })
        .reduce((acc, curr) => acc + curr.amount, 0);

    const activeSubscribers = Array.from(new Set(payments.map(p => p.tenantId))).length;
    const failureRate = payments.length > 0 ? (payments.filter(p => p.status === 'FAILED').length / payments.length) * 100 : 0;

    return (
        <div className="p-4 md:p-8 lg:p-12 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Finansal Takip & İşlemler</h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base font-medium">Platform genelindeki abonelik tahsilatlarını, MRR oranlarını ve fatura geçmişini merkezi olarak izleyin.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <button className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-black flex items-center justify-center gap-2.5 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                        <Download size={20} /> Veri İndir
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex-1 sm:flex-none bg-[#ff7a21] text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <DollarSign size={20} strokeWidth={3} /> Manuel Veri Ekle
                    </button>
                </div>
            </div>

            {/* High-End Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                    <div className="absolute -right-5 -top-5 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a21] shadow-[0_0_8px_rgba(255,122,33,0.5)]"></div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Toplam Tahsilat Hacmi</p>
                                </div>
                                <h3 className="text-4xl font-black tracking-tighter leading-none">₺{totalRevenue.toLocaleString('tr-TR')}</h3>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[#ff7a21] shadow-xl">
                                <TrendingUp size={32} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                ANLIK VERİ AKIŞI
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 italic uppercase">Son 24 Saat</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-500">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Aylık Tahsilat (MRR)</p>
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none group-hover:text-[#ff7a21] transition-colors transition-all">₺{monthlyRevenue.toLocaleString('tr-TR')}</h3>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-500 group-hover:bg-[#ff7a21] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                            <ArrowUpRight size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">Ortalama İşlem: <span className="text-gray-900 font-black">₺{(totalRevenue / (payments.length || 1)).toFixed(0)}</span></p>
                        <span className="text-[10px] font-black text-[#ff7a21] uppercase tracking-tighter">Artış +12.4%</span>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-500 md:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Başarı Oranı</p>
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none group-hover:text-emerald-500 transition-colors">%{(100 - failureRate).toFixed(1)}</h3>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                            <CheckCircle2 size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400"><span className="text-emerald-500 font-black">{activeSubscribers}</span> Aktif Benzersiz Abone</p>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-emerald-400' : 'bg-slate-100'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
                <div className="overflow-hidden">
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 bg-white shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                    <Clock size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">İşlem Geçmişi</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-0.5 tracking-tight">Platform genelinde gerçekleşen tüm finansal hareketler.</p>
                                </div>
                            </div>
                            <div className="relative w-full sm:w-auto overflow-hidden">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="İşlem veya müşteri ara..."
                                    className="w-full sm:w-80 pl-14 pr-6 py-4 rounded-[20px] border border-slate-200 bg-slate-50/50 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-[#ff7a21] focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-slate-400/70 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">İşlem / Tarih</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Kayıt / Kanal</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tutar</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="p-40 text-center">
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="relative">
                                                        <div className="w-20 h-20 rounded-full border-4 border-slate-50 border-t-[#ff7a21] animate-spin"></div>
                                                        <CreditCard size={32} className="absolute inset-0 m-auto text-slate-200 animate-pulse" />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Veri Ambarı Sorgulanıyor</span>
                                                        <span className="text-[10px] font-bold text-slate-400 italic">Bulut sunucuları ile güvenli bağlantı kuruluyor...</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center">
                                                <div className="p-10 bg-rose-50 rounded-[40px] border border-rose-100 inline-block">
                                                    <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
                                                    <div className="text-sm font-black text-rose-600 uppercase tracking-widest mb-2">Bağlantı Hatası</div>
                                                    <div className="text-xs font-bold text-rose-400 italic max-w-sm">{error}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-40 text-center">
                                                <div className="flex flex-col items-center gap-8">
                                                    <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                        <CreditCard size={80} strokeWidth={1} />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">İşlem Kaydı Bulunmuyor</span>
                                                        <button onClick={() => setModalOpen(true)} className="text-[10px] font-black text-[#ff7a21] underline underline-offset-4 hover:text-orange-600 transition-colors uppercase tracking-widest mt-2">İLK Manuel Girişi Yapın</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50 transition-all duration-300 group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#ff7a21] shadow-sm group-hover:bg-[#ff7a21] group-hover:text-white transition-all duration-300">
                                                            <DollarSign size={20} strokeWidth={3} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-gray-900 group-hover:text-[#ff7a21] transition-colors tracking-tight">#{p.id.substring(0, 8).toUpperCase()}</div>
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1">
                                                                <Calendar size={12} className="text-orange-400" /> {new Date(p.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-sm font-black text-gray-900 hover:text-[#ff7a21] transition-colors cursor-pointer">{p.tenant?.name || 'BELİRSİZ'}</div>
                                                    <div className="text-[10px] font-bold text-slate-300 mt-1 tracking-widest uppercase">ID: {p.tenantId?.substring(0, 8)}</div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-sm font-bold text-slate-600 line-clamp-1">{p.title}</div>
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl mt-3 text-[9px] font-black tracking-widest border transition-all ${p.paymentMethod.includes('Kart') ? 'bg-blue-50 text-blue-500 border-blue-100 group-hover:bg-blue-500 group-hover:text-white group-hover:border-transparent' : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-slate-900 group-hover:text-white group-hover:border-transparent'}`}>
                                                        <CreditCard size={10} /> {p.paymentMethod.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform origin-left">₺{p.amount.toLocaleString('tr-TR')}</div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-6">
                                                        <div className={`px-5 py-2.5 rounded-2xl text-[9px] font-black tracking-[0.15em] border shadow-sm transition-all ${p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-500 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-emerald-500/20' : p.status === 'PENDING' ? 'bg-orange-50 text-[#ff7a21] border-orange-100 group-hover:bg-[#ff7a21] group-hover:text-white group-hover:border-transparent group-hover:shadow-orange-500/20' : 'bg-rose-50 text-rose-500 border-rose-100 group-hover:bg-rose-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-rose-500/20'}`}>
                                                            {p.status === 'COMPLETED' ? 'ONAYLANDI' : p.status === 'PENDING' ? 'BEKLEMEDE' : 'HATA'}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(p.id)}
                                                            className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-rose-500 hover:bg-rose-100/50 hover:shadow-inner rounded-2xl transition-all duration-300"
                                                        >
                                                            <Trash2 size={20} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="xl:sticky xl:top-8 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group">
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="bg-orange-500/10 p-3 rounded-2xl text-[#ff7a21]">
                                    <TrendingUp size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Dağılım Analizi</h3>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text">Online Tahsilat</span>
                                        <span className="text-sm font-black">%74.2</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#ff7a21] to-orange-400 w-[74%] rounded-full shadow-lg shadow-orange-500/20"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text">Banka / EFT</span>
                                        <span className="text-sm font-black">%25.8</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 w-[26%] rounded-full shadow-lg shadow-blue-500/20"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                                <div className="flex items-center gap-3 text-[#ff7a21] mb-2">
                                    <AlertCircle size={18} />
                                    <span className="text-xs font-black uppercase tracking-wider">İşlem Bilgisi</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                                    Mutabakatlar her gün saat 00:00'da Iyzico Bridge üzerinden otomatik olarak başlatılır.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 border-l-4 border-l-rose-500">
                        <div className="flex gap-4">
                            <div className="bg-rose-50 p-3 rounded-2xl shrink-0 text-rose-500">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-2">İade Politikası</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-bold italic">
                                    Kartlı işlemler panel üzerinden, havale iadeleri manuel onay ile gerçekleştirilir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manuel Payment Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[40px] p-8 md:p-12 shadow-2xl animate-in zoom-in duration-300">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-10">
                            <div className="w-16 h-16 bg-orange-50 text-[#ff7a21] rounded-3xl flex items-center justify-center mb-6">
                                <PlusCircle size={32} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Yeni Tahsilat Kaydı</h3>
                            <p className="text-slate-500 font-medium mt-1">Dış tahsilatları finansal raporlamaya dahil edin.</p>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İlgili Restoran</label>
                                <select
                                    required
                                    value={formData.tenantId}
                                    onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">İşletme Seçiniz...</option>
                                    {tenants.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İşlem Detayı</label>
                                <input
                                    type="text" required
                                    value={formData.title}
                                    placeholder="Örn: 12 Aylık Pro Plan"
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Tutar (₺)</label>
                                <input
                                    type="number" required
                                    value={formData.amount}
                                    placeholder="0.00"
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ödeme Kanalı</label>
                                <select
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="CREDIT_CARD">POS / Kredi Kartı</option>
                                    <option value="HAVALE">Banka / EFT</option>
                                    <option value="CASH">Nakit</option>
                                </select>
                            </div>
                            <button
                                type="submit" disabled={isSaving}
                                className="md:col-span-2 mt-4 bg-[#ff7a21] text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-70 transition-all"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                                {isSaving ? 'İşleniyor...' : 'Kayıt Oluştur ve Onayla'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
