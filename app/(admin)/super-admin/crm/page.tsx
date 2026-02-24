"use client";
import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, MessageSquare, Plus, Loader2, TrendingUp, CheckCircle2, X, Check, AlertCircle, MoreVertical, Trash2, Filter } from 'lucide-react';

export default function CRMPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('ALL');

    // Modal & Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        restaurant: '',
        email: '',
        phone: '',
        notes: ''
    });

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/crm');
            if (!res.ok) throw new Error('CRM verileri yüklenemedi');
            const data = await res.json();
            setLeads(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleAddLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/crm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                await fetchLeads();
                setIsAddModalOpen(false);
                setFormData({ name: '', restaurant: '', email: '', phone: '', notes: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/crm', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) fetchLeads();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm('Bu potansiyel müşteriyi silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/admin/crm?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchLeads();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredLeads = leads.filter(l => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PENDING') return l.status === 'PENDING';
        if (activeFilter === 'CONVERTED') return l.status === 'CONVERTED';
        if (activeFilter === 'LOST') return l.status === 'LOST';
        return true;
    });

    const stats = {
        total: leads.length,
        pending: leads.filter(l => l.status === 'PENDING').length,
        converted: leads.filter(l => l.status === 'CONVERTED').length,
        conversionRate: leads.length > 0
            ? ((leads.filter(l => l.status === 'CONVERTED').length / leads.length) * 100).toFixed(1)
            : '0'
    };

    return (
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Page Header */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        CRM & Müşteri İlişkileri
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-medium leading-relaxed">
                        Potansiyel müşteri akışını yönetin, görüşme notlarını takip edin ve dönüşüm oranlarını analiz edin.
                    </p>
                </div>
                <div className="w-full xl:w-auto">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full xl:w-auto bg-[#ff7a21] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                    >
                        <Plus size={20} strokeWidth={3} /> Yeni Lead Tanımla
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                    { label: 'Toplam Aday', value: stats.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', shadow: 'hover:shadow-blue-500/5' },
                    { label: 'Bekleyenler', value: stats.pending, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', shadow: 'hover:shadow-orange-500/5' },
                    { label: 'Dönüşüm Oranı', value: `%${stats.conversionRate}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', shadow: 'hover:shadow-emerald-500/5' },
                    { label: 'Dönüşenler', value: stats.converted, icon: CheckCircle2, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100', shadow: 'hover:shadow-violet-500/5' }
                ].map((stat, i) => (
                    <div key={i} className={`group bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl ${stat.shadow} transition-all duration-500 border-2 border-transparent hover:border-gray-100 relative overflow-hidden`}>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{loading ? '...' : stat.value}</h3>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-5 rounded-3xl border ${stat.border} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                <stat.icon size={28} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 items-start">
                <div className="space-y-10 min-w-0">
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Lead Akışı</h3>
                                <span className="bg-white border-2 border-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-400 tracking-widest uppercase shadow-sm">
                                    {filteredLeads.length} KAYIT
                                </span>
                            </div>
                        </div>

                        <div className="p-10">
                            {loading ? (
                                <div className="py-40 text-center">
                                    <Loader2 className="animate-spin text-[#ff7a21] mx-auto mb-6" size={48} />
                                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Veriler Senkronize Ediliyor...</p>
                                </div>
                            ) : error ? (
                                <div className="p-10 text-center font-black text-rose-500 bg-rose-50 rounded-[32px] border-2 border-rose-100">{error}</div>
                            ) : filteredLeads.length === 0 ? (
                                <div className="py-40 text-center flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8 text-gray-200 border-2 border-gray-100 shadow-inner">
                                        <Users size={48} strokeWidth={1} />
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 mb-2">Eşleşen Kayıt Bulunamadı</h4>
                                    <p className="text-gray-400 font-bold max-w-[320px] leading-relaxed italic">Seçili filtrelere uygun potansiyel müşteri kaydı mevcut değil.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {filteredLeads.map((lead) => (
                                        <div key={lead.id} className="group relative bg-white rounded-[40px] border-2 border-gray-50 p-8 md:p-10 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500 overflow-hidden hover:border-orange-100">
                                            {/* Glow Effect */}
                                            <div className="absolute -left-10 -top-10 w-40 h-40 bg-gray-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                            <div className="relative flex flex-col lg:flex-row gap-10 items-start">
                                                <div className="w-16 h-16 bg-gray-900 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-xl shadow-gray-900/20 group-hover:bg-[#ff7a21] group-hover:shadow-orange-500/30 group-hover:rotate-6 transition-all duration-500">
                                                    <Users size={28} strokeWidth={1.5} />
                                                </div>

                                                <div className="flex-1 space-y-8 w-full">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                                        <div>
                                                            <h4 className="text-2xl font-black text-gray-900 tracking-tight flex flex-wrap items-center gap-3">
                                                                {lead.name}
                                                                {lead.restaurant && <span className="text-gray-400 font-black text-sm px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">/ {lead.restaurant}</span>}
                                                            </h4>
                                                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-3">
                                                                <Calendar size={14} className="text-[#ff7a21]" />
                                                                KAYIT: {new Date(lead.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                                            <div className="relative flex-1 sm:flex-none">
                                                                <select
                                                                    value={lead.status}
                                                                    onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                                                                    className={`w-full sm:w-48 text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest border-2 transition-all cursor-pointer outline-none appearance-none text-center shadow-sm ${lead.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' :
                                                                            lead.status === 'PENDING' ? 'bg-orange-50 text-[#ff7a21] border-orange-100 shadow-orange-500/5' :
                                                                                'bg-gray-50 text-gray-500 border-gray-100'
                                                                        }`}
                                                                >
                                                                    <option value="PENDING">BEKLEMEDE</option>
                                                                    <option value="CONTACTED">GÖRÜŞÜLDÜ</option>
                                                                    <option value="CONVERTED">DÖNÜŞTÜ</option>
                                                                    <option value="LOST">KAYBEDİLDİ</option>
                                                                </select>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteLead(lead.id)}
                                                                className="w-12 h-12 flex items-center justify-center border-2 border-rose-50 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shrink-0 shadow-sm"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50/50 rounded-3xl p-6 border-2 border-gray-50 group-hover:border-orange-50 group-hover:bg-white transition-all">
                                                        <p className="text-sm text-gray-600 font-bold leading-relaxed italic border-l-4 border-orange-200 pl-6 py-1">
                                                            {lead.notes || 'Görüşme notu bulunmuyor.'}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4">
                                                        {lead.email && (
                                                            <div className="flex items-center gap-4 text-xs font-black text-gray-700 bg-gray-50 px-5 py-3 rounded-2xl group/link cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all border-2 border-transparent hover:border-gray-100">
                                                                <div className="bg-orange-100 p-2 rounded-xl text-[#ff7a21] group-hover/link:rotate-12 transition-transform shadow-sm">
                                                                    <Mail size={16} strokeWidth={2.5} />
                                                                </div>
                                                                {lead.email}
                                                            </div>
                                                        )}
                                                        {lead.phone && (
                                                            <div className="flex items-center gap-4 text-xs font-black text-gray-700 bg-gray-50 px-5 py-3 rounded-2xl group/link cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all border-2 border-transparent hover:border-gray-100">
                                                                <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600 group-hover/link:scale-110 transition-transform shadow-sm">
                                                                    <Phone size={16} strokeWidth={2.5} />
                                                                </div>
                                                                {lead.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="xl:sticky xl:top-8 flex flex-col gap-10">
                    <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="absolute -right-20 -top-20 w-56 h-56 bg-orange-500/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-1.5 h-10 bg-[#ff7a21] rounded-full shadow-[0_0_20px_rgba(255,122,33,0.5)]"></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Kategori Filtresi</h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'ALL', label: 'Bütün Potansiyeller' },
                                    { id: 'PENDING', label: 'Bekleyen Adaylar' },
                                    { id: 'CONVERTED', label: 'Dönüşen İşletmeler' },
                                    { id: 'LOST', label: 'Arşivlenmiş' }
                                ].map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`w-full p-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.15em] text-left transition-all duration-300 border-2 ${activeFilter === filter.id ? 'bg-[#ff7a21] border-[#ff7a21] text-white shadow-xl shadow-orange-500/20 scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 border-l-[6px] border-l-emerald-500 group hover:shadow-2xl hover:shadow-emerald-500/5 transition-all">
                        <div className="flex gap-6 items-start">
                            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-[24px] shrink-0 border-2 border-emerald-100 group-hover:rotate-6 transition-transform">
                                <TrendingUp size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-gray-900 mb-3 tracking-tight">Dönüşüm Rehberi</h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-bold italic">
                                    Potansiyel adaylara <span className="text-emerald-500 font-black underline decoration-emerald-200 underline-offset-4">ilk 24 saat</span> içinde dönüş yapmak, satış şansını %65'e kadar artırır.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative w-full max-w-3xl bg-white rounded-[50px] p-10 md:p-16 shadow-2xl animate-in zoom-in duration-500 border-2 border-gray-100">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-10 right-10 w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all font-black border-2 border-transparent hover:border-rose-100 shadow-sm"
                        >
                            <X size={28} />
                        </button>

                        <div className="mb-12">
                            <div className="w-20 h-20 bg-gray-900 text-white rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-gray-900/20">
                                <Plus size={40} strokeWidth={3} />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Yeni Lead Tanımla</h3>
                            <p className="text-gray-400 font-bold mt-2 text-lg italic">Satış sürecini başlatmak için aday bilgilerini sisteme kaydedin.</p>
                        </div>

                        <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Yetkili Ad Soyad</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Örn: Ahmet Yılmaz"
                                    className="w-full px-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">İşletme / Restoran</label>
                                <input
                                    type="text"
                                    value={formData.restaurant}
                                    onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                                    placeholder="Örn: Gurme Burger"
                                    className="w-full px-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">İletişim E-Posta</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="örnek@mail.com"
                                    className="w-full px-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Telefon Numarası</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="05..."
                                    className="w-full px-8 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Görüşme Detayları / Notlar</label>
                                <textarea
                                    rows={4}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="İlk görüşme çıktılarını not alın..."
                                    className="w-full px-8 py-5 rounded-3xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all resize-none shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="md:col-span-2 mt-6 bg-gray-900 text-white py-6 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-gray-900/30 hover:bg-[#ff7a21] hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-70 transition-all uppercase tracking-widest"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={28} /> : <Check size={28} strokeWidth={4} />}
                                {isSaving ? 'İşleniyor...' : 'Aday Kaydını Onayla'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}
