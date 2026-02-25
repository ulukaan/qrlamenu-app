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
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Finansal Takip & İşlemler</h1>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Platform genelindeki abonelik tahsilatlarını, MRR oranlarını ve fatura geçmişini merkezi olarak izleyin.</p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="h-9 px-4 rounded-[6px] bg-white border border-slate-200 text-slate-600 font-semibold text-[13px] hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                        <Download size={14} /> <span>Veri İndir</span>
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="h-9 px-4 rounded-[6px] bg-slate-900 text-white font-semibold text-[13px] hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={14} /> <span>Manuel Veri Ekle</span>
                    </button>
                </div>
            </div>

            {/* Corporate Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900 p-5 rounded-[6px] shadow-sm border border-slate-800 text-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-800 text-emerald-400 rounded-[4px]">
                            <DollarSign size={20} />
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Canlı Akış</span>
                        </div>
                    </div>
                    <h3 className="text-[28px] font-bold tracking-tight leading-none mb-1">₺{totalRevenue.toLocaleString('tr-TR')}</h3>
                    <p className="text-[12px] font-medium text-slate-400">Toplam Tahsilat Hacmi</p>
                </div>

                <div className="bg-white p-5 rounded-[6px] shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-[4px]">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-[4px] uppercase tracking-widest">+12.4% Artış</span>
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                        <h3 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">₺{monthlyRevenue.toLocaleString('tr-TR')}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[12px] font-medium text-slate-500">Aylık Tahsilat (MRR)</p>
                        <p className="text-[11px] font-semibold text-slate-400">Ort: ₺{(totalRevenue / (payments.length || 1)).toFixed(0)}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-[6px] shadow-sm border border-slate-200 md:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-[4px]">
                            <CheckCircle2 size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-[4px] uppercase tracking-widest">{activeSubscribers} Aktif</span>
                    </div>
                    <h3 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none mb-1">%{(100 - failureRate).toFixed(1)}</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-[12px] font-medium text-slate-500">İşlem Başarısı</p>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-1 h-2 rounded-full ${i <= 4 ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="overflow-hidden">
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-1.5 rounded-[4px] border border-slate-200 text-slate-500">
                                    <Clock size={16} />
                                </div>
                                <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">İşlem Geçmişi</h3>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="İşlem veya müşteri ara..."
                                    className="w-full pl-9 pr-3 py-1.5 h-8 rounded-[4px] border border-slate-200 bg-white text-[13px] text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left text-[13px]">
                                <thead className="bg-white border-b border-slate-200">
                                    <tr className="text-slate-500">
                                        <th className="px-5 py-3 font-semibold w-[20%]">İşlem / Tarih</th>
                                        <th className="px-5 py-3 font-semibold w-[25%]">Müşteri</th>
                                        <th className="px-5 py-3 font-semibold w-[25%]">Kayıt / Kanal</th>
                                        <th className="px-5 py-3 font-semibold w-[15%]">Tutar</th>
                                        <th className="px-5 py-3 font-semibold w-[15%] text-right">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                                                    <span className="text-slate-500 font-medium text-[13px]">Veriler yükleniyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} className="py-16 text-center">
                                                <div className="text-rose-500 font-medium text-[13px]">{error}</div>
                                            </td>
                                        </tr>
                                    ) : payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="text-slate-400">
                                                        <CreditCard size={32} />
                                                    </div>
                                                    <span className="text-slate-500 font-medium text-[13px]">İşlem kaydı bulunmuyor</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">#{p.id.substring(0, 8)}</div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5">
                                                        {new Date(p.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900 truncate">{p.tenant?.name || '-'}</div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">ID: {p.tenantId?.substring(0, 8) || '-'}</div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-slate-700 truncate">{p.title}</div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">
                                                        {p.paymentMethod}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900">₺{p.amount.toLocaleString('tr-TR')}</div>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <div className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-widest uppercase border transition-colors ${p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : p.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                                                            {p.status === 'COMPLETED' ? 'Onaylandı' : p.status === 'PENDING' ? 'Bekliyor' : 'Hata'}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(p.id)}
                                                            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
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
                    <div className="bg-slate-900 rounded-[6px] p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-slate-800 p-2 rounded-[4px] text-indigo-400">
                                    <TrendingUp size={16} />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Dağılım Analizi</h3>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Online Tahsilat</span>
                                        <span className="text-[13px] font-bold">%74.2</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[74%] rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Banka / EFT</span>
                                        <span className="text-[13px] font-bold">%25.8</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-500 w-[26%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-slate-800/50 rounded-[4px] border border-slate-700/50">
                                <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                                    <AlertCircle size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Sistem Bilgisi</span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    Mutabakatlar her gün 00:00'da sağlayıcı üzerinden otomatik başlar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 rounded-[6px] p-5 shadow-sm border border-rose-100 flex gap-3 items-start">
                        <div className="bg-rose-100 p-1.5 rounded-[4px] shrink-0 text-rose-500 mt-0.5">
                            <AlertCircle size={16} />
                        </div>
                        <div>
                            <h4 className="text-[12px] font-bold text-rose-900 uppercase tracking-wider mb-1">İade Politikası</h4>
                            <p className="text-[11px] text-rose-700 leading-relaxed font-medium">
                                Kartlı işlemler sistemden, havale iadeleri manuel onayla yapılır.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manuel Payment Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setModalOpen(false)} />
                    <div className="relative w-full max-w-[500px] bg-white rounded-[8px] p-6 shadow-xl animate-in zoom-in-95 duration-200 border border-slate-200">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-[4px] transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">Yeni Tahsilat Kaydı</h3>
                            <p className="text-[13px] text-slate-500 mt-1">Dış tahsilatları finansal raporlamaya dahil edin.</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">İlgili Restoran</label>
                                <select
                                    required
                                    value={formData.tenantId}
                                    onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                                    className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                >
                                    <option value="">İşletme Seçiniz...</option>
                                    {tenants.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">İşlem Detayı</label>
                                <input
                                    type="text" required
                                    value={formData.title}
                                    placeholder="Örn: 12 Aylık Pro Plan"
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Net Tutar (₺)</label>
                                    <input
                                        type="number" required
                                        value={formData.amount}
                                        placeholder="0.00"
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Ödeme Kanalı</label>
                                    <select
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                    >
                                        <option value="CREDIT_CARD">POS / Kredi Kartı</option>
                                        <option value="HAVALE">Banka / EFT</option>
                                        <option value="CASH">Nakit</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-[6px] border border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit" disabled={isSaving}
                                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-[6px] font-semibold text-[13px] hover:bg-slate-800 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : null}
                                    {isSaving ? 'İşleniyor...' : 'Onayla ve Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
